import cors from "@fastify/cors";
import Fastify from "fastify";
import { ENTRYPOINT_ADDRESS_V07 } from "permissionless";
import { createPimlicoBundlerClient } from "permissionless/clients/pimlico";
import { http } from "viem";
import { getAnvilWalletClient, getChain } from "./helpers/utils";
import { setupSbcPaymasterV07 } from "./helpers/verifyingPaymasters";
import { setupBalanceVerifyingPaymasterV07 } from "./helpers/balanceVerifyingPaymasters";
import { createSbcRpcHandler } from "./relay";
import { setupSampleNft } from "./helpers/sampleNft";
import { setupSampleErc20 } from "./helpers/sampleErc20";

(async () => {
  const walletClient = await getAnvilWalletClient();

  const altoBundlerV07 = createPimlicoBundlerClient({
    chain: await getChain(),
    transport: http(process.env.ALTO_RPC),
    entryPoint: ENTRYPOINT_ADDRESS_V07,
  });

  // Setup the SBC token and mint some tokens to the walletClient
  const numTokens = 100n;
  const sbcToken = await setupSampleErc20(walletClient, numTokens);

  // Setup the Balance Verifying Paymaster
  const REQUIRED_SBC_BALANCE = 100n * 10n ** 18n;
  const paymasterV07 = await setupBalanceVerifyingPaymasterV07(walletClient, sbcToken.address, REQUIRED_SBC_BALANCE);

  await setupSampleNft(walletClient);

  const app = Fastify({});

  app.register(cors, {
    origin: "*",
    methods: ["POST", "GET", "OPTIONS"],
  });

  const rpcHandler = createSbcRpcHandler(
    altoBundlerV07,
    paymasterV07,
    walletClient
  );

  app.post("/", {}, rpcHandler);

  app.get("/ping", async (_request, reply) => {
    return reply.code(200).send({ message: "pong" });
  });

  await app.listen({ host: "0.0.0.0", port: 3000 });
})();
