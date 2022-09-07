import { ethers, network } from 'hardhat';
import { networkConfig } from '../../helper-hardhat.config';

export const getDaiPrice = async () => {
  const daiEthPriceFeed = await ethers.getContractAt(
    'AggregatorV3Interface',
    networkConfig[network.config.chainId!].daiEthPriceFeed!
  );
  const price = (await daiEthPriceFeed.latestRoundData())[1];
  console.log(`The DAI/ETH price is ${price.toString()}`);
  return price;
};
