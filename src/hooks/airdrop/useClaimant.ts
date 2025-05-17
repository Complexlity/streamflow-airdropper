import { QUERY_KEYS } from '@/config/constants'
import { getClaimantByAddress } from '@/services/api/airdropService'
import { useQuery } from '@tanstack/react-query'

export const useClaimantData = (airdropId: string | undefined, walletAddress: string | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEYS.getClaimantData, { airdropId, walletAddress }],
    queryFn: async () => {
      if (!airdropId || !walletAddress) return null
      return await getClaimantByAddress(airdropId, walletAddress)
    },
    enabled: !!airdropId && !!walletAddress,
  })
}
