import { env } from '@/config/env'
import { ApiError } from '@/types/error'
import type { Wallet } from '@solana/wallet-adapter-react'
import { clusterApiUrl } from '@solana/web3.js'
import { StreamflowDistributorSolana } from '@streamflow/distributor'
import type { IClaimData, ICreateDistributorData, IGetClaimData } from '@streamflow/distributor/solana'
import BN from 'bn.js'

const distributorClient = new StreamflowDistributorSolana.SolanaDistributorClient({
  clusterUrl: env.solana.rpcEndpoint || clusterApiUrl(env.solana.cluster),
  cluster: env.solana.cluster,
})

/**
 * Create a new airdrop distribution
 * @param data Distribution data
 * @param wallet Connected wallet
 * @returns Transaction result
 */
export const createDistributor = async (data: ICreateDistributorData, wallet: Wallet) => {
  try {
    const result = await distributorClient.create(data, {
      // @ts-expect-error: The adapter type is compatible but TypeScript doesn't recognize it
      invoker: wallet.adapter,
    })

    return result
  } catch (error) {
    console.error('Error creating distribution:', error)
    throw new ApiError('Failed to create distribution', 'streamflow_error', error)
  }
}

/**
 * Claim tokens from an airdrop
 * @param claimData Claim data including proof
 * @param wallet Connected wallet
 * @returns Transaction result
 */
export const claimAirdrop = async (
  claimData: {
    amountLocked: BN
    amountUnlocked: BN
    id: string
    proof: number[][]
  },
  wallet: Wallet,
) => {
  try {
    const result = await distributorClient.claim(claimData, {
      // @ts-expect-error: The adapter type is compatible but TypeScript doesn't recognize it
      invoker: wallet.adapter,
    })

    return result
  } catch (error) {
    console.error('Error claiming airdrop:', error)
    throw new ApiError('Failed to claim airdrop', 'streamflow_error', error)
  }
}

/**
 * Prepare claim instructions (to check eligibility)
 * @param claimData Claim data
 * @param wallet Connected wallet
 * @returns Prepared instructions or null if not eligible
 * @description This is used as a backup to check if the user has claimed their airdrop or not. Propagation to the api can be slow but if the user has claimed, getting the instructions will fail.
 */
export const prepareClaimInstructions = async (claimData: IClaimData, wallet: Wallet) => {
  try {
    return await distributorClient.prepareClaimInstructions(claimData, {
      // @ts-expect-error: The adapter type is compatible but TypeScript doesn't recognize it
      invoker: wallet.adapter,
    })
  } catch (error) {
    // This means the user is eligible but has already claimed
    if (error && typeof error === 'object' && 'message' in error && error.message === 'invalid account discriminator') {
      return null
    }

    console.error('Error preparing claim instructions:', error)
    throw new ApiError('Failed to prepare claim instructions', 'streamflow_error', error)
  }
}

/**
 * Get claim status for a recipient
 * @param distributorId Distributor ID
 * @param claimantAddress Recipient address
 * @returns Claim status
 */
export const getClaimStatus = async (distributorId: string, claimantAddress: string) => {
  try {
    const data: IGetClaimData = {
      id: distributorId,
      recipient: claimantAddress,
    }

    return await distributorClient.getClaims([data])
  } catch (error) {
    console.error('Error getting claim status:', error)
    throw new ApiError('Failed to get claim status', 'streamflow_error', error)
  }
}
