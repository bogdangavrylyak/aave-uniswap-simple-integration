import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-gas-reporter';
import 'dotenv/config';
import 'solidity-coverage';
import 'hardhat-deploy';
import 'solidity-coverage';

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL || 'https://eth-rinkeby';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '0xkey';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'key';
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || 'key';
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || '';

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.7',
      },
      {
        version: '0.6.6',
      },
      {
        version: '0.6.12',
      },
      {
        version: '0.4.19',
      },
      {
        version: '0.7.5',
      },
      {
        version: '0.6.0',
      },
      {
        version: '0.7.6',
      },
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 31337,
      forking: {
        url: MAINNET_RPC_URL,
      },
    },
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 4,
      // blockConfirmations: 6,
    },
    localhost: {
      url: 'http://127.0.0.1:8545/',
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: false,
    outputFile: 'gas-report.txt',
    noColors: true,
    currency: 'USD',
    // coinmarketcap: COINMARKETCAP_API_KEY,
    token: 'ETH',
  },
  mocha: {
    timeout: 300000, // 300 seconds
  },
};

export default config;
