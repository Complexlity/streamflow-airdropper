import { Connection, Keypair } from '@solana/web3.js';
import fs from 'fs';
import { config } from 'dotenv'

config()

const devnetRpcUrl = 'https://api.devnet.solana.com'
const connection = new Connection(devnetRpcUrl)


const keypair = Keypair.generate();
const secretKey = Array.from(keypair.secretKey); // Convert Uint8Array to array of numbers
fs.writeFileSync('keypair.json', JSON.stringify(secretKey)); // Save as JSON array

console.log('Keypair saved to keypair.json. You can import it into Phantom Wallet.');

const publicKey = keypair.publicKey
console.log('Public Key:', publicKey.toBase58)

const airdropSignature = await connection.requestAirdrop(publicKey, 1000000000)
console.log('Airdrop signature:', airdropSignature)

connection.confirmTransaction(airdropSignature)

