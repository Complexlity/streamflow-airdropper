import { clusterApiUrl, Connection, Keypair } from '@solana/web3.js'
import { ICluster } from '@streamflow/common'
import fs from 'fs'

const connection = new Connection(clusterApiUrl(ICluster.Devnet), 'confirmed')

const keypair = Keypair.generate()

console.log('Keypair generated:', keypair.publicKey.toBase58())

const secretKey = Array.from(keypair.secretKey) 
fs.writeFileSync('keypair.json', JSON.stringify(secretKey)) 

console.log('Keypair saved to keypair.json. You can import it into Phantom Wallet.')

const publicKey = keypair.publicKey
console.log('Public Key:', publicKey.toBase58)

const airdropSignature = await connection.requestAirdrop(publicKey, 1000000000)
console.log('Airdrop signature:', airdropSignature)

connection.confirmTransaction(airdropSignature)
