import { useQuery } from '@tanstack/react-query'
import { getTokenMetadata, getTokenPrice } from '@/services/api/tokenService'
import { QUERY_KEYS } from '@/config/constants'
export const useTokenMetadata = (mintAddress: string | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEYS.getTokenMetadata, mintAddress],
    queryFn: () => (mintAddress ? getTokenMetadata(mintAddress) : null),
    enabled: !!mintAddress,
  })
}
export const useTokenPrice = (mintAddress: string | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEYS.getTokenPrice, mintAddress],
    queryFn: () => (mintAddress ? getTokenPrice(mintAddress) : 0),
    enabled: !!mintAddress,
  })
}
