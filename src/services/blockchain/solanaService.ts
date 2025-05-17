import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { env } from '@/config/env'
import { type WalletTokenBalances } from '@/types/token'
import { getTokenMetadata } from '@/services/api/tokenService'


const connection = new Connection(env.solana.rpcEndpoint || clusterApiUrl(env.solana.cluster), 'confirmed')

/**
 * Get token balances for a wallet
 * @param address Wallet address
 * @returns Token balances
 */
export const getTokenBalances = async (address: string): Promise<WalletTokenBalances> => {
  try {
    const publicKey = new PublicKey(address)

    const lamports = await connection.getBalance(publicKey)
    const sol = lamports / 1e9

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID,
    })

    const filteredTokenAccounts = tokenAccounts.value.filter(
      ({ account }) => Number(account.data.parsed.info.tokenAmount.uiAmount) > 0,
    )

    const tokenPromises = filteredTokenAccounts.map(async ({ account }) => {
      const mintAddress = account.data.parsed.info.mint
      const amount = Number(account.data.parsed.info.tokenAmount.uiAmountString)

      try {
        const metadata = await getTokenMetadata(mintAddress)

        return {
          mint: mintAddress,
          amount,
          name: metadata.name,
          symbol: metadata.symbol,
          decimals: metadata.decimals,
          image: metadata.image,
        }
      } catch (error) {
        console.error('Error fetching token metadata:', error)
        return {
          mint: mintAddress,
          amount,
          name: 'Unknown Token',
          symbol: 'UNK'+ mintAddress.slice(0, 3),
          decimals: account.data.parsed.info.tokenAmount.decimals,
          image: '/placeholder.svg',
        }
      }
    })

    const tokens = (await Promise.all(tokenPromises)).filter(Boolean)

    return {
      sol,
      tokens,
    }
  } catch (error) {
    console.error('Error fetching token balances:', error)
    throw error
  }
}
