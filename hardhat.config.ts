import type { HardhatUserConfig, NetworkUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-web3";
import '@nomicfoundation/hardhat-verify';
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-deploy";
import "hardhat-abi-exporter";
import "hardhat-contract-sizer";
import "solidity-coverage";
import "dotenv/config";

import './tasks/mint_test';

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

const exsat_testnet3: NetworkUserConfig = {
  url: "https://evm-tst3.exactsat.io",
  chainId: 839999,
  accounts: [process.env.KEY_EXSAT_TESTNET!],
  verify: {
    etherscan: {
      apiUrl: 'https://scan-testnet.exsat.network',
    }
  },
};

const exsat_mainnet: NetworkUserConfig = {
  url: "https://evm.exsat.network",
  chainId: 7200,
  accounts: [process.env.KEY_EXSAT_MAINNET!],
  verify: {
    etherscan: {
      apiUrl: 'https://scan.exsat.network/api',
    }
  },
};



const mainnet: NetworkUserConfig = {
  url: "https://api.evm.eosnetwork.com",
  chainId: 17777,
  accounts: [process.env.KEY_MAINNET!],
  verify: {
    etherscan: {
      apiUrl: 'https://explorer.evm.eosnetwork.com'
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
    exsat_testnet3,
    exsat_mainnet,
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
  blockscout: {
    enabled: true,
		customChains: [
			{
				network: 'exsat_testnet3',
				chainId: 839999,
				urls: {
					apiURL: 'https://scan-testnet.exsat.network/api',
					browserURL: 'https://scan-testnet.exsat.network',
				},
			},
			{
				network: 'exsat_mainnet',
				chainId: 7200,
				urls: {
					apiURL: 'https://scan.exsat.network/api',
					browserURL: 'https://scan.exsat.network',
				},
			},
    ]
  },
	sourcify: {
		enabled: false,
	}
};

export default config;
