import axios from 'axios'
import { env } from '@/config/env'
import type {
  AirdropByIDRequest,
  AirdropCreateData,
  AirdropSearchResult,
  AirdropSearchResultItem,
  ClaimableAirdropItem,
  ClaimableAirdropResult,
  CsvRecipients,
} from '@/types/airdrop'
import { ApiError } from '@/types/error'

const axiosStreamflow = axios.create({
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

/**
 * Get airdrop by ID
 * @param distributorId Distributor ID
 * @returns Airdrop data
 */
export const getAirdropById = async (distributorId: string): Promise<AirdropCreateData> => {
  try {
    const response = await axiosStreamflow.get<AirdropByIDRequest[]>(`${env.api.proxyServerUrl}/airdrops/${distributorId}`)

    if (!response.data || response.data.length === 0) {
      throw new ApiError('Airdrop not found', 'not_found')
    }

    const responseData = response.data[0]
    const data: Partial<AirdropCreateData> = {}

    data.type = responseData.totalAmountLocked !== '0' ? 'Vested' : 'Instant'

    const maxTotal = BigInt(responseData.maxTotalClaim)
    const locked = BigInt(responseData.totalAmountLocked)
    const unlocked = BigInt(responseData.totalAmountUnlocked)
    data.amountClaimed = (maxTotal - locked - unlocked).toString()

    return {
      ...responseData,
      ...data,
    }
  } catch (error) {
    console.error('Error fetching airdrop:', error)
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('Failed to fetch airdrop data', 'api_error', error)
  }
}

/**
 * Get all airdrops
 * @param limit Number of airdrops to fetch
 * @param offset Pagination offset
 * @returns List of airdrops
 */
export const getAllAirdrops = async (limit = 100, offset = 0): Promise<AirdropSearchResultItem[]> => {
  try {
    const response = await axiosStreamflow.post<AirdropSearchResult>(`${env.api.proxyServerUrl}/airdrops/search`, {
      actor: '',
      limit,
      offset,
      filters: {
        include: {
          isOnChain: true,
          isActive: true,
        },
      },
      sorters: [{ by: 'id', order: 'desc' }],
    })
    return response.data.items
  } catch (error) {
    console.error('Error fetching all airdrops:', error)
    throw new ApiError('Failed to fetch airdrops data', 'api_error', error)
  }
}

/**
 * Get claimable airdrops for an address
 * @param address Wallet address
 * @param limit Number of airdrops to fetch
 * @returns Claimable airdrops
 */
export const getClaimableAirdrops = async (address: string, limit = 100): Promise<ClaimableAirdropResult['items']> => {
  try {
    const response = await axiosStreamflow.get<ClaimableAirdropResult>(
      `${env.api.proxyServerUrl}/airdrops/claimable/${address}`,
      {
        params: {
          limit,
          skimZeroValued: true,
        },
      },
    )

    return response.data.items
  } catch (error) {
    console.error('Error fetching claimable airdrops:', error)
    throw new ApiError('Failed to fetch claimable airdrops', 'api_error', error)
  }
}

/**
 * Get claimant by address
 * @param distributorId Distributor ID
 * @param claimantAddress Claimant address
 * @returns Claimant data
 */
export const getClaimantByAddress = async (
  distributorId: string,
  claimantAddress: string,
): Promise<ClaimableAirdropItem | null> => {
  try {
    const response = await axios.get<ClaimableAirdropItem | null>(
      `${env.api.proxyServerUrl}/claimant/${distributorId}/${claimantAddress}`,
    )

    return response.data
  } catch (error) {
    console.error('Error fetching claimant from server:', error)
    throw new ApiError('Failed to fetch claimant data', 'api_error', error)
  }
}

/**
 * Create airdrop merkle root
 * @param data Airdrop data
 * @returns Merkle root data
 */
export const createAirdropMerkleRoot = async ({
  recepients,
  name,
  mint,
}: {
  recepients: CsvRecipients
  name: string
  mint: string
}): Promise<{
  merkleRoot: number[]
  chain: string
  mint: string
  version: number
  address: string
  sender: string
  name: string
  maxNumNodes: string
  maxTotalClaim: string
  totalAmountUnlocked: string
  totalAmountLocked: string
  isActive: boolean
  isOnChain: boolean
  isVerified: boolean
}> => {
  try {
    const response = await axios.post(
      `${env.api.proxyServerUrl}/merkle`,
      {
        recepients,
        name,
        mint,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    )

    return response.data
  } catch (error) {
    console.error('Error creating airdrop merkle root:', error)
    throw new ApiError('Failed to create airdrop merkle root', 'api_error', error)
  }
}
