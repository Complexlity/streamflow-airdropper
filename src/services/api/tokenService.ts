import axios from 'axios'
import { env } from '@/config/env'
import { type PriceResult, type TokenMetadata } from '@/types/token'
import type { ICluster } from '@streamflow/common'
import { ApiError } from '@/types/error'

/**
 * Get token metadata
 * @param mint Token mint address
 * @param cluster Solana cluster
 * @returns Token metadata
 */
export const getTokenMetadata = async (
  mint: string,
  cluster: ICluster = env.solana.cluster,
): Promise<TokenMetadata> => {
  try {
    const response = await axios.post(
      `${env.api.proxyServer}/token-meta`,
      {
        addresses: [mint],
        cluster,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    )

    if (!response.data || !response.data[mint]) {
      throw new ApiError(`Token metadata not found for ${mint}`, 'not_found')
    }

    return response.data[mint] as TokenMetadata
  } catch (error) {
    console.error('Error fetching token metadata:', error)
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('Failed to fetch token metadata', 'api_error', error)
  }
}

/**
 * Get token price
 * @param tokenAddress Token address
 * @param cluster Solana cluster
 * @returns Token price in USD
 */
export const getTokenPrice = async (tokenAddress: string, cluster = 'devnet'): Promise<number> => {
  try {
    const endpoint = `${env.api.proxyServer}/price?ids=${tokenAddress}&cluster=${cluster}`
    const response = await fetch(endpoint)

    if (!response.ok) {
      throw new Error(`Failed to fetch price for token ${tokenAddress}`)
    }

    const data = (await response.json()) as PriceResult
    return data?.data?.[tokenAddress]?.value ?? 0
  } catch (error) {
    console.error('Error fetching token price:', error)
    return 0 
  }
}
