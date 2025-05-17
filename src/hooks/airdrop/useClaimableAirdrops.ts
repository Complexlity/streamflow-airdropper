import { QUERY_KEYS } from '@/config/constants'
import { getAirdropById, getClaimableAirdrops } from '@/services/api/airdropService'
import { useQuery } from '@tanstack/react-query'

export const useClaimableAirdrops = (walletAddress?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.getClaimableAirdrop, walletAddress],
    queryFn: async () => {
      if (!walletAddress) return null
      const claimable = await getClaimableAirdrops(walletAddress)
      if (!Array.isArray(claimable)) return []

      //Claimable query does not return required results so we also getAirdropById
      const details = await Promise.all(
        claimable.map(async (item) => {
          const airdrop = await getAirdropById(item.distributorAddress)
          return { ...item, ...airdrop }
        }),
      )
      return details
    },
    enabled: !!walletAddress,
  })
}
