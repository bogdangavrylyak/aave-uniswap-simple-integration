import { ethers, getNamedAccounts, network } from 'hardhat';
import { networkConfig, AMOUNT } from '../../helper-hardhat.config';
import { SimpleSwap, SimpleSwap__factory } from '../../typechain-types';

const ercAbi = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  // Authenticated Functions
  'function transfer(address to, uint amount) returns (bool)',
  'function deposit() public payable',
  'function approve(address spender, uint256 amount) returns (bool)',
];

const main = async () => {
  // swap amountToRepayPerc ETH to DAI and repay
  const { deployer } = await getNamedAccounts();

  const simpleSwapFactory: SimpleSwap__factory = (await ethers.getContractFactory(
    'SimpleSwap'
  )) as SimpleSwap__factory;

  const simpleSwap: SimpleSwap = await simpleSwapFactory.deploy(
    networkConfig[network.config.chainId!].swapRouter!,
    networkConfig[network.config.chainId!].daiToken!,
    networkConfig[network.config.chainId!].wethToken!
  );
  await simpleSwap.deployed();

  const signers = await ethers.getSigners();

  const WETH = new ethers.Contract(
    networkConfig[network.config.chainId!].wethToken!,
    ercAbi,
    signers[0]
  );

  const deposit = await WETH.deposit({ value: ethers.utils.parseEther('10') });
  await deposit.wait(1);

  console.log('signers[0]: ', signers[0].address);
  console.log('deployer: ', deployer);

  const DAI = new ethers.Contract(
    networkConfig[network.config.chainId!].daiToken!,
    ercAbi,
    signers[0]
  );
  const expandedDAIBalanceBefore = await DAI.balanceOf(signers[0].address);

  await WETH.approve(simpleSwap.address, ethers.utils.parseEther('1'));
  const amountIn = ethers.utils.parseEther('0.1');
  const swap = await simpleSwap.swapWETHForDAI(amountIn, { gasLimit: 300000 });
  await swap.wait(1);
  const expandedDAIBalanceAfter = await DAI.balanceOf(deployer);
  console.log('expandedDAIBalanceBefore: ', expandedDAIBalanceBefore.toString());
  console.log('expandedDAIBalanceAfter: ', expandedDAIBalanceAfter.toString());
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// const deposit = await WETH.deposit({
//   value: amountToRepayPerc,
// });

// await deposit.wait(1);

// await approveErc20(
//   networkConfig[network.config.chainId!].wethToken!,
//   swapContract.address,
//   amountToRepayPerc.toString(),
//   deployer
// );

// await swapWETHForDAI(swapContract, amountToRepayPerc.toString());

// const swapWETHForDAI = async (swapContract: SimpleSwap, amountIn: string) => {
//   const swap = await swapContract.swapWETHForDAI(amountIn /*, { gasLimit: 300000 }*/);
//   await swap.wait(1);
// };

// const getSwapContract = async () => {
//   const simpleSwapFactory: SimpleSwap__factory = (await ethers.getContractFactory(
//     'SimpleSwap'
//   )) as SimpleSwap__factory;

//   const simpleSwap: SimpleSwap = await simpleSwapFactory.deploy(
//     networkConfig[network.config.chainId!].swapRouter!,
//     networkConfig[network.config.chainId!].daiToken!,
//     networkConfig[network.config.chainId!].wethToken!
//   );

//   await simpleSwap.deployed();

//   return simpleSwap;
// };

// await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT.toString(), deployer);
// console.log('Depositing...');
// await lendingPool.deposit(wethTokenAddress, AMOUNT.toString(), deployer, 0);
// console.log('Deposited');

// const repay = async (
//   amount: string,
//   daiAddress: string,
//   lendingPool: Contract,
//   account: Address
// ) => {
//   try {
//     await approveErc20(daiAddress, lendingPool.address, amount, account);
//     const repayTx = await lendingPool.repay(daiAddress, amount, 1, account);
//     await repayTx.wait(1);
//     console.log('Repaid!');
//   } catch (error) {
//     console.log('error: ', error);
//   }
// };

// const borrowDai = async (
//   daiAddress: string,
//   lendingPool: Contract,
//   amountDaiToBorrow: string,
//   account: Address
// ) => {
//   const borrowTx = await lendingPool.borrow(daiAddress, amountDaiToBorrow, 1, 0, account);
//   await borrowTx.wait(1);
//   console.log("You've borrowed!");
// };

// const getBorrowUserData = async (lendingPool: Contract, account: Address) => {
//   const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
//     await lendingPool.getUserAccountData(account);
//   console.log(`You have ${totalCollateralETH} worth of ETH deposited`);
//   console.log(`You have ${totalDebtETH} worth of ETH borrowed`);
//   console.log(`You can borrow ${availableBorrowsETH} worth of ETH`);
//   return { availableBorrowsETH, totalDebtETH };
// };

// const getLendingPool = async (account: Address) => {
//   const lendingPoolAddressesProvider = await ethers.getContractAt(
//     'ILendingPoolAddressesProvider',
//     networkConfig[network.config.chainId!].lendingPoolAddressesProvider!,
//     // @ts-expect-error
//     account
//   );

//   const lendingPoolAddress = await lendingPoolAddressesProvider.getLendingPool();
//   const lendingPool = await ethers.getContractAt(
//     'ILendingPool',
//     lendingPoolAddress,
//     // @ts-expect-error
//     account
//   );
//   return lendingPool;
// };

// const getDaiPrice = async () => {
//   const daiEthPriceFeed = await ethers.getContractAt(
//     'AggregatorV3Interface',
//     networkConfig[network.config.chainId!].daiEthPriceFeed!
//   );
//   const price = (await daiEthPriceFeed.latestRoundData())[1];
//   console.log(`The DAI/ETH price is ${price.toString()}`);
//   return price;
// };

// const approveErc20 = async (
//   erc20Address: string,
//   spenderAddress: string,
//   amount: string,
//   signer: Address
// ) => {
//   const erc20Token = await ethers.getContractAt(
//     'IERC20',
//     erc20Address,
//     // @ts-expect-error
//     signer
//   );

//   const tx = await erc20Token.approve(spenderAddress, amount);
//   await tx.wait(1);
//   console.log('Approved!');
// };
