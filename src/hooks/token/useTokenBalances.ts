import { useQuery } from '@tanstack/react-query'
import { getTokenBalances } from '@/services/blockchain/solanaService'
import { QUERY_KEYS } from '@/config/constants'

export const useTokenBalances = (walletAddress?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.getTokenBalances, walletAddress],
    queryFn: () => (walletAddress ? getTokenBalances(walletAddress) : null),
    enabled: !!walletAddress,
  })
}
