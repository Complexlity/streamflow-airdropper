import {
  Connection,
  Keypair,
  PublicKey,
  clusterApiUrl,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
} from '@solana/web3.js'
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createSyncNativeInstruction,
} from '@solana/spl-token'
import bs58 from 'bs58'

const PRIVATE_KEY = `<your-private-key>`
const AMOUNT_SOL = 2

const WSOL_MINT = new PublicKey('So11111111111111111111111111111111111111112')

async function wrapSol() {
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
  const payer = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY))
  console.log({ payerAddress: payer.publicKey.toBase58() })

  const ata = await getAssociatedTokenAddress(
    WSOL_MINT,
    payer.publicKey,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  )

  const ataInfo = await connection.getAccountInfo(ata)
  const instructions: TransactionInstruction[] = []

  if (!ataInfo) {
    instructions.push(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: ata,
        space: 165,
        lamports: await connection.getMinimumBalanceForRentExemption(165),
        programId: TOKEN_PROGRAM_ID,
      }),
    )
  }

  instructions.push(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: ata,
      lamports: AMOUNT_SOL * LAMPORTS_PER_SOL,
    }),
    createSyncNativeInstruction(ata),
  )

  const tx = new Transaction().add(...instructions)
  const sig = await connection.sendTransaction(tx, [payer], { skipPreflight: false })
  await connection.confirmTransaction(sig, 'confirmed')

  console.log(`Wrapped ${AMOUNT_SOL} SOL into wSOL. Transaction: https://explorer.solana.com/tx/${sig}?cluster=devnet`)
}

wrapSol().catch(console.error)
