import { ethers, network } from 'hardhat';
import { Address } from 'hardhat-deploy/dist/types';
import { networkConfig } from '../../helper-hardhat.config';

export const getLendingPool = async (account: Address) => {
  const lendingPoolAddressesProvider = await ethers.getContractAt(
    'ILendingPoolAddressesProvider',
    networkConfig[network.config.chainId!].lendingPoolAddressesProvider!,
    // @ts-expect-error
    account
  );

  const lendingPoolAddress = await lendingPoolAddressesProvider.getLendingPool();
  const lendingPool = await ethers.getContractAt(
    'ILendingPool',
    lendingPoolAddress,
    // @ts-expect-error
    account
  );

  console.log('lendingPool address: ', lendingPool.address);

  return lendingPool;
};
