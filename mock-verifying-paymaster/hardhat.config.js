// SPDX-License-Identifier: MIT

require("@nomicfoundation/hardhat-chai-matchers");
require("@nomicfoundation/hardhat-network-helpers");
require("@typechain/hardhat");
require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

// Load environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000000";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const BASE_SEPOLIA_RPC_URL = process.env.BASE_SEPOLIA_RPC_URL || "";
// const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.23",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Local network
    hardhat: {
      chainId: 31337,
      mining: {
        auto: true,
        interval: 1000
      }
    },
    localhost: {
      chainId: 31337,
      url: "http://127.0.0.1:8545"
    },

    // Testnets
    baseSepolia: {
      url: `${BASE_SEPOLIA_RPC_URL}`,
      accounts: [PRIVATE_KEY],
      chainId: 84532,
      verify: {
        etherscan: {
          apiKey: ETHERSCAN_API_KEY
        }
      }
    },

    // // Mainnets
    // mainnet: {
    //   url: `${MAINNET_RPC_URL}`,
    //   accounts: [PRIVATE_KEY],
    //   chainId: 1,
    //   verify: {
    //     etherscan: {
    //       apiKey: ETHERSCAN_API_KEY
    //     }
    //   }
    // }
  },
  typechain: {
    outDir: 'typechain-types',
    target: 'ethers-v6',
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
};
