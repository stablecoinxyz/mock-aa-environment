# mock-app

This is a mock app for showing how to send user operations and have a custom paymaster pay for gas. In this case, we are minting a `SampleNFT`.

You can find the `SampleNFT` as well as the `Paymaster` contract in the `mock-verifying-paymaster/contracts` directory.

The paymaster contract is a simple contract tha user's signature and then pays for the gas.

The NFT's ABI in `mock-app/src/abi.ts` is the same as the one generated artifact from `mock-verifying-paymaster`.
