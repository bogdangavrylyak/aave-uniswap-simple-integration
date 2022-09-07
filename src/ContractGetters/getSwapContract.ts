import { ethers, network } from 'hardhat';
import { networkConfig } from '../../helper-hardhat.config';
import { SimpleSwap, SimpleSwap__factory } from '../../typechain-types';

export const getSwapContract = async () => {
  const simpleSwapFactory: SimpleSwap__factory = (await ethers.getContractFactory(
    'SimpleSwap'
  )) as SimpleSwap__factory;

  const simpleSwap: SimpleSwap = await simpleSwapFactory.deploy(
    networkConfig[network.config.chainId!].swapRouter!,
    networkConfig[network.config.chainId!].daiToken!,
    networkConfig[network.config.chainId!].wethToken!
  );

  await simpleSwap.deployed();

  return simpleSwap;
};
