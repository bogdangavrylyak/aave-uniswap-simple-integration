import { Contract } from 'ethers';
import { Address } from 'hardhat-deploy/dist/types';
import { approveErc20 } from '../utils/approveERC20';

export class AaveIntegrationService {
  constructor(private readonly lendingPool: Contract) {}

  public async getBorrowUserData(account: Address) {
    const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
      await this.lendingPool.getUserAccountData(account);
    console.log(`You have ${totalCollateralETH} worth of ETH deposited`);
    console.log(`You have ${totalDebtETH} worth of ETH borrowed`);
    console.log(`You can borrow ${availableBorrowsETH} worth of ETH`);
    return { availableBorrowsETH, totalDebtETH };
  }

  public async repay(amount: string, daiAddress: string, account: Address) {
    try {
      await approveErc20(daiAddress, this.lendingPool.address, amount, account);
      const repayTx = await this.lendingPool.repay(daiAddress, amount, 1, account);
      await repayTx.wait(1);
      console.log('Repaid!');
    } catch (error) {
      console.log('error: ', error);
    }
  }

  public async borrowDai(daiAddress: string, amountDaiToBorrow: string, account: Address) {
    const borrowTx = await this.lendingPool.borrow(daiAddress, amountDaiToBorrow, 1, 0, account);
    await borrowTx.wait(1);
    console.log('Borrowed!');
  }

  public async deposit(wethTokenAddress: string, amountWethToDeposit: string, account: Address) {
    await approveErc20(
      wethTokenAddress,
      this.lendingPool.address,
      amountWethToDeposit.toString(),
      account
    );
    console.log('Depositing...');
    await this.lendingPool.deposit(wethTokenAddress, amountWethToDeposit.toString(), account, 0);
    console.log('Deposited');
  }
}
