import { ethers, getNamedAccounts, network } from 'hardhat';
import { networkConfig, AMOUNT } from '../helper-hardhat.config';
import { AaveIntegrationService } from './services/aave.integration.service';
import { getDai, getWeth, getLendingPool, getDaiPrice, getSwapContract } from './ContractGetters';
import { UniswapIntegrationService } from './services/uniswap.integration.service';
import { WethService } from './services/weth.service';

const main = async () => {
  const { deployer } = await getNamedAccounts();
  const lendingPool = await getLendingPool(deployer);
  const WETH = await getWeth(deployer);
  const DAI = await getDai(deployer);
  const daiPrice = await getDaiPrice();
  const swapContract = await getSwapContract();
  const aaveIntegrationService = new AaveIntegrationService(lendingPool);
  const wethService = new WethService(WETH);
  const uniswapIntegrationService = new UniswapIntegrationService(swapContract, wethService);
  const wethTokenAddress = networkConfig[network.config.chainId!].wethToken!;
  const daiTokenAddress = networkConfig[network.config.chainId!].daiToken!;

  // weth deposit
  await wethService.deposit(AMOUNT.toString());
  const wethBalance = await WETH.balanceOf(deployer);
  console.log(`Got ${wethBalance.toString()} WETH`);

  // aave weth deposit
  await aaveIntegrationService.deposit(wethTokenAddress, AMOUNT.toString(), deployer);

  // get borrow data
  const { availableBorrowsETH } = await aaveIntegrationService.getBorrowUserData(deployer);
  const amountDaiToBorrow = availableBorrowsETH.toString() * 0.95 * (1 / daiPrice.toNumber());
  console.log(`You can borrow ${amountDaiToBorrow} DAI`);
  const amountDaiToBorrowWei = ethers.utils.parseEther(amountDaiToBorrow.toString());
  console.log(`amountDaiToBorrowWei: ${amountDaiToBorrow}`);

  // borrow
  await aaveIntegrationService.borrowDai(
    daiTokenAddress,
    amountDaiToBorrowWei.toString(),
    deployer
  );
  await aaveIntegrationService.getBorrowUserData(deployer);

  // repay
  await aaveIntegrationService.repay(amountDaiToBorrowWei.toString(), daiTokenAddress, deployer);
  await aaveIntegrationService.getBorrowUserData(deployer);

  // repay left perc borrowed WETH
  // swap amountToRepayPerc WETH to DAI
  const { totalDebtETH: amountToRepayPerc } = await aaveIntegrationService.getBorrowUserData(
    deployer
  );
  console.log('amountToRepayPerc: ', amountToRepayPerc.toString());

  const expandedDAIBalanceBefore = await DAI.balanceOf(deployer);
  console.log('expandedDAIBalanceBefore: ', expandedDAIBalanceBefore.toString());

  await uniswapIntegrationService.swapWETHForDAI(amountToRepayPerc, deployer);

  const expandedDAIBalanceAfter = await DAI.balanceOf(deployer);
  console.log('expandedDAIBalanceAfter: ', expandedDAIBalanceAfter.toString());

  // repay left perc WETH borrowed with DAI
  await aaveIntegrationService.repay(expandedDAIBalanceAfter.toString(), daiTokenAddress, deployer);
  await aaveIntegrationService.getBorrowUserData(deployer);
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
