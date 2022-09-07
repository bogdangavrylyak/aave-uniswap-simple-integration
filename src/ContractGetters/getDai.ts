import { ethers, network } from 'hardhat';
import { Address } from 'hardhat-deploy/dist/types';
import { networkConfig } from '../../helper-hardhat.config';

export const getDai = async (account: Address) => {
  const DAI = await ethers.getContractAt(
    'IERC20',
    networkConfig[network.config.chainId!].daiToken!,
    // @ts-expect-error
    account
  );
  return DAI;
};
