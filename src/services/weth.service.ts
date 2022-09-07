import { Contract } from 'ethers';

export class WethService {
  constructor(private readonly WETH: Contract) {}

  public async deposit(amountWethToDeposit: string) {
    const txResponse = await this.WETH.deposit({
      value: amountWethToDeposit,
    });
    await txResponse.wait(1);
  }
}
