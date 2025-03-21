import {
	http,
	createWalletClient,
	createPublicClient,
	defineChain,
	type Address,
} from "viem";
import { mnemonicToAccount } from "viem/accounts";

/// Returns the bigger of two BigInts.
export const maxBigInt = (a: bigint, b: bigint) => {
	return a > b ? a : b;
};

export const getTrustedSigner = (): Address => {
	return "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc" as Address;
};

export const getAnvilWalletClient = async () => {
	const account = mnemonicToAccount(
		"test test test test test test test test test test test junk",
		{
			/* avoid nonce error with index 0 when deploying ep contracts. */
			addressIndex: 5,
		},
	);

	const walletClient = createWalletClient({
		account,
		chain: await getChain(),
		transport: http(process.env.ANVIL_RPC),
	});

	return walletClient;
};

export const getChain = async () => {
	const tempClient = createPublicClient({
		transport: http(process.env.ANVIL_RPC),
	});

	const chain = defineChain({
		id: await tempClient.getChainId(),
		name: "chain",
		nativeCurrency: {
			name: "ETH",
			symbol: "ETH",
			decimals: 18,
		},
		rpcUrls: {
			default: {
				http: [],
				webSocket: undefined,
			},
		},
	});

	return chain;
};
