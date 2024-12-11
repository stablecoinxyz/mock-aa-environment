# mock-aa-environment

This repo sets up a local Account Abstraction (AA) environment using docker containers.

One of the benefits enabled by Account Abstraction is for developers to pay gas on behalf of users. This is done by deploying and funding a paymaster contract, and setting up a Paymaster service that is compatible with the Paymaster contract and the target version of the EntryPoint. By abstracting wallet functionality into Smart contracts (Smart Accounts), and packaging bundler and paymaster functionality into a "Smart Account Client", we can send "user operations" (specially packaged transactions) and have our custom paymaster pay for the gas.

So we have these components in this environment in `docker-compose.yml`:

Anvil: a local testnet Ethereum blockchain node shipped with [Foundry](https://book.getfoundry.sh/anvil/). The Pimlico team has prepared a docker image for Anvil, which is used in this environment.

Bundler (Alto): A service that listens for user operations and bundles them into a single transaction. This is the entry point for user operations. For ease of use, we use the [Alto bundler image](ghcr.io/pimlicolabs/mock-alto-bundler:main) prepared by Pimlico.

Paymaster: A smart contract that pays for the gas of user operations. The smart contract used is an "approve all" contract, which means it will approve any funding request. We set this up in `mock-verifying-paymaster` and put funds in the EntryPoint.

App: A demo app showing how to use the Paymaster by preparing and sending a user operation (minting an NFT) to the Bundler.

## Usage

Start the environment:

```bash
docker compose up
```

Shutdown the environment:

```bash
docker compose down
```

Clean up the environment (after changing any code that requires rebuilding of image(s)):

```bash
docker rmi <image_id>
```

## Paymaster Smart Contract

This mock paymaster is an "approve all" paymaster that does not perform any signature validations (i.e. it approves any user operation). It's located in the `mock-verifying-paymaster/contracts` directory. It's compiled using hardhat during the build of the `mock-verifying-paymaster` image.

To use your own custom contract, place it in the `mock-verifying-paymaster/contracts` directory and rebuild the `mock-verifying-paymaster` image. You'll need to fund the contract on the EntryPoint in order to use it. A reference of how to fund the contract can be found in the `mock-verifying-paymaster/src/helpers/verifyingPaymasters.ts` file in the `setupSbcPaymasterV07` function.

## Acknowledgements

Special thanks to the Pimlico team for having the original setup of the AA environment, including images of Anvil node and their own Alto bundler.

## Author

- [@Ectsang](https://www.github.com/Ectsang)
