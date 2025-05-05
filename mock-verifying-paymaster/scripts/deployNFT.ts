import { type Account, type Chain, type Transport, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import { setupSampleNft } from '../src/helpers/sampleNft';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

if (!process.env.PRIVATE_KEY) {
  throw new Error('PRIVATE_KEY environment variable is required');
}

if (!process.env.BASE_SEPOLIA_RPC_URL) {
  throw new Error('BASE_SEPOLIA_RPC_URL environment variable is required');
}

async function main() {
  try {
    // Create wallet client connected to Base Sepolia
    const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);
    
    const client = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(process.env.BASE_SEPOLIA_RPC_URL)
    });

    console.log('Deploying SampleNFT...');
    const nft = await setupSampleNft(client);
    console.log('SampleNFT deployment completed!');
    console.log('Contract address:', nft.address);
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

// Execute deployment
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
