import { createPublicClient, http, encodeAbiParameters, parseAbiParameters } from 'viem';
import { baseSepolia } from 'viem/chains';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

// Load environment variables from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.BASESCAN_API_KEY) {
  throw new Error('BASESCAN_API_KEY environment variable is required');
}

if (!process.env.CONTRACT_ADDRESS) {
  throw new Error('CONTRACT_ADDRESS environment variable is required');
}

async function checkVerificationStatus(guid: string, apiKey: string): Promise<boolean> {
  const statusData = {
    apikey: apiKey,
    guid,
    module: 'contract',
    action: 'checkverifystatus'
  };

  const response = await fetch(`https://api-sepolia.basescan.org/api?${new URLSearchParams(statusData)}`);
  const result = await response.json();

  if (result.result === 'Pending in queue') {
    return false;
  }

  if (result.result === 'Pass - Verified') {
    return true;
  }

  throw new Error(`Verification failed: ${result.result}`);
}

async function main() {
  try {
    const contractAddress = process.env.CONTRACT_ADDRESS as `0x${string}`;
    const apiKey = process.env.BASESCAN_API_KEY;

    if (!apiKey) {
      throw new Error('BASESCAN_API_KEY is undefined');
    }

    // Flatten the contract
    console.log('Flattening contract...');
    const flattenedPath = path.resolve(__dirname, '../contracts/SampleNFT.flattened.sol');
    execSync(`npx hardhat flatten contracts/SampleNFT.sol > ${flattenedPath}`, {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit'
    });

    // Read the flattened source code and clean up license identifiers
    let sourceCode = fs.readFileSync(flattenedPath, 'utf8');
    
    // Remove all but the first SPDX license identifier
    const spdxPattern = /\/\/ SPDX-License-Identifier: .*/g;
    const matches = sourceCode.match(spdxPattern);
    if (matches && matches.length > 0) {
      sourceCode = sourceCode.replace(spdxPattern, '');
      sourceCode = matches[0] + '\n' + sourceCode;
    }

    // Read the compiler version from the source and format it correctly
    const versionMatch = '0.8.23';
    const compilerVersion = `v${versionMatch.replace('^', '')}+commit.f704f362`;

    // Encode constructor arguments
    const constructorArgs = encodeAbiParameters(
      parseAbiParameters('string name, string symbol'),
      ['SampleNFT', 'SNFT']
    ).slice(2); // Remove '0x' prefix

    // Prepare verification data
    const verificationData: Record<string, string> = {
      apikey: apiKey,
      module: 'contract',
      action: 'verifysourcecode',
      sourceCode,
      contractaddress: contractAddress,
      codeformat: 'solidity-single-file',
      contractname: 'SampleNFT',
      compilerversion: compilerVersion,
      optimizationUsed: '1', // Set to 1 since hardhat uses optimization by default
      runs: '200',
      constructorArguements: constructorArgs,
      evmversion: 'paris',
      licenseType: '3' // MIT License
    };

    // Submit verification request
    console.log('Submitting verification request...');
    console.log('Using compiler version:', compilerVersion);
    console.log('Constructor arguments:', constructorArgs);
    const response = await fetch('https://api-sepolia.basescan.org/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(verificationData),
    });

    const result = await response.json();

    if (result.status === '1') {
      const guid = result.result;
      console.log('Verification submitted successfully!');
      console.log('GUID:', guid);
      
      // Poll for verification status
      console.log('Checking verification status...');
      let verified = false;
      let attempts = 0;
      const maxAttempts = 10;

      while (!verified && attempts < maxAttempts) {
        attempts++;
        try {
          verified = await checkVerificationStatus(guid, apiKey);
          if (verified) {
            console.log('Contract verified successfully!');
            console.log(`View on Basescan: https://sepolia.basescan.org/address/${contractAddress}#code`);
            break;
          }
          console.log('Verification still pending, waiting 10 seconds...');
          await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
        } catch (error) {
          console.error('Verification status check failed:', error);
          break;
        }
      }

      if (!verified) {
        console.log('Verification taking longer than expected. Please check status manually at:');
        console.log(`https://sepolia.basescan.org/address/${contractAddress}#code`);
        console.log('Using GUID:', guid);
      }
    } else {
      console.error('Verification submission failed:', result.result);
    }

    // Clean up flattened file
    fs.unlinkSync(flattenedPath);

  } catch (error) {
    console.error('Verification failed:', error);
    process.exit(1);
  }
}

// Execute verification
main().catch((error) => {
  console.error('Verification failed:', error);
  process.exit(1);
}); 