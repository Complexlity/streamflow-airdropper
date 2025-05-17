import { QUERY_KEYS } from '@/config/constants'
import { getAirdropById } from '@/services/api/airdropService'
import { useQuery } from '@tanstack/react-query'

export const useAirdropDetails = (airdropId: string | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEYS.getAirdropById, airdropId],
    queryFn: () => (airdropId ? getAirdropById(airdropId) : null),
    enabled: !!airdropId,
  })
}
