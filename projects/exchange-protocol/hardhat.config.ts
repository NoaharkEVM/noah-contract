import type { HardhatUserConfig, NetworkUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-deploy";
import "hardhat-abi-exporter";
import "hardhat-contract-sizer";
import "solidity-coverage";
import "dotenv/config";

import * as fs from 'fs-extra';

const defaultNetwork = 'localhost';

function mnemonic() {
  try {
    return fs.readFileSync('./mnemonic.txt').toString().trim();
  } catch (e) {
    if (defaultNetwork !== 'localhost') {
      console.log('☢️ WARNING: No mnemonic file created for a deploy account.');
    }
  }
  return '';
}

const testnet: NetworkUserConfig = {
  url: "https://api-testnet2.trust.one",
  chainId: 15557,
  accounts: [process.env.KEY_TESTNET!],
  verify: {
    etherscan: {
      apiUrl: 'https://explorer-testnet2.trust.one',
    }
  },
};

const mainnet: NetworkUserConfig = {
  url: "https://api2-testnet.trust.one",
  chainId: 56,
  accounts: [process.env.KEY_MAINNET!],
  verify: {
    etherscan: {
      apiUrl: 'https://api.testnet-dev.trust.one'
    }
  },
};

const hardhat: NetworkUserConfig = {
  accounts: {
    mnemonic: mnemonic(),
    count: 30,
    path: "m/44'/60'/0'/0",
    initialIndex: 0,
    accountsBalance: '10000000000000000000000',
    passphrase: '',
  },
};
const ganache: NetworkUserConfig = {
  // url: 'http://192.168.50.238:7545',
  url: 'http://127.0.0.1:7545',
  accounts: {
    mnemonic: mnemonic(),
    count: 30,
    path: "m/44'/60'/0'/0",
    initialIndex: 0,
    accountsBalance: '10000000000000000000000',
    passphrase: '',
  },
};

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat,
    ganache,
    testnet,
    mainnet,
  },
  namedAccounts: {
    deployer:  {
      default: 0
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.13",
        settings: {
          optimizer: {
            enabled: true,
            runs: 99999,
          },
        },
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 99999,
          },
        },
      },
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 99999,
          },
        },
      },
      {
        version: "0.4.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 99999,
          },
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  abiExporter: {
    path: "./data/abi",
    clear: true,
    flat: false,
  },
  verify: {
    etherscan: {
      apiKey: 'a'
    }
  },
};

export default config;
