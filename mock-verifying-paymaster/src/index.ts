import cors from "@fastify/cors";
import Fastify from "fastify";
import { ENTRYPOINT_ADDRESS_V07 } from "permissionless";
import { createPimlicoBundlerClient } from "permissionless/clients/pimlico";
import { http } from "viem";
import { getAnvilWalletClient, getChain } from "./helpers/utils";
import {
  // setupVerifyingPaymasterV06,
  // setupVerifyingPaymasterV07,
  setupSbcPaymasterV07,
} from "./helpers/verifyingPaymasters";
import { createSbcRpcHandler } from "./relay";
import { setupSampleNft } from "./helpers/sampleNft";

// const main = async () => {
//   const walletClient = await getAnvilWalletClient();
//   const verifyingPaymasterV07 = await setupVerifyingPaymasterV07(walletClient);
//   const verifyingPaymasterV06 = await setupVerifyingPaymasterV06(walletClient);

//   const altoBundlerV07 = createPimlicoBundlerClient({
//     chain: await getChain(),
//     transport: http(process.env.ALTO_RPC),
//     entryPoint: ENTRYPOINT_ADDRESS_V07,
//   });

//   const altoBundlerV06 = createPimlicoBundlerClient({
//     chain: await getChain(),
//     transport: http(process.env.ALTO_RPC),
//     entryPoint: ENTRYPOINT_ADDRESS_V06,
//   });

//   const app = Fastify({});

//   app.register(cors, {
//     origin: "*",
//     methods: ["POST", "GET", "OPTIONS"],
//   });

//   const rpcHandler = createRpcHandler(
//     altoBundlerV07,
//     altoBundlerV06,
//     verifyingPaymasterV07,
//     verifyingPaymasterV06,
//     walletClient
//   );
//   app.post("/", {}, rpcHandler);

//   app.get("/ping", async (_request, reply) => {
//     return reply.code(200).send({ message: "pong" });
//   });

//   await app.listen({ host: "0.0.0.0", port: 3000 });
// };

// main();

(async () => {
  // trusted signer
  const walletClient = await getAnvilWalletClient();

  const paymasterV07 = await setupSbcPaymasterV07(walletClient);

  const altoBundlerV07 = createPimlicoBundlerClient({
    chain: await getChain(),
    transport: http(process.env.ALTO_RPC),
    entryPoint: ENTRYPOINT_ADDRESS_V07,
  });

  const nft = await setupSampleNft(walletClient);

  const app = Fastify({});

  app.register(cors, {
    origin: "*",
    methods: ["POST", "GET", "OPTIONS"],
  });

  const rpcHandler = createSbcRpcHandler(
    altoBundlerV07,
    paymasterV07 as any,
    walletClient
  );

  app.post("/", {}, rpcHandler);

  app.get("/ping", async (_request, reply) => {
    return reply.code(200).send({ message: "pong" });
  });

  await app.listen({ host: "0.0.0.0", port: 3000 });
})();
