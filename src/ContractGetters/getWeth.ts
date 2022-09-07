import { ethers, network } from 'hardhat';
import { Address } from 'hardhat-deploy/dist/types';
import { networkConfig } from '../../helper-hardhat.config';

export const getWeth = async (account: Address) => {
  const iWeth = await ethers.getContractAt(
    'IWeth',
    networkConfig[network.config.chainId!].wethToken!,
    // @ts-expect-error
    account
  );
  return iWeth;
};
