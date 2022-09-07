import { network } from 'hardhat';
import { Address } from 'hardhat-deploy/dist/types';
import { networkConfig } from '../../helper-hardhat.config';
import { SimpleSwap } from '../../typechain-types';
import { approveErc20 } from '../utils/approveERC20';
import { WethService } from './weth.service';

export class UniswapIntegrationService {
  constructor(
    private readonly swapContract: SimpleSwap,
    private readonly wethService: WethService
  ) {}

  public async swapWETHForDAI(amountToRepayPerc: string, signer: Address) {
    await this.wethService.deposit(amountToRepayPerc);

    await approveErc20(
      networkConfig[network.config.chainId!].wethToken!,
      this.swapContract.address,
      amountToRepayPerc.toString(),
      signer
    );

    const swap = await this.swapContract.swapWETHForDAI(amountToRepayPerc, { gasLimit: 300000 });
    await swap.wait(1);
  }
}
