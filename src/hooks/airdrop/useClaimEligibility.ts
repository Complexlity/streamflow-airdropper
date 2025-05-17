import { useQuery } from '@tanstack/react-query'
import { useWallet } from '@solana/wallet-adapter-react'
import { prepareClaimInstructions } from '@/services/blockchain/streamflowService'
import { QUERY_KEYS } from '@/config/constants'
import { BN } from 'bn.js'
import type { ClaimableAirdropItem, ClaimEligibilityData } from '@/types/airdrop'

export const useClaimEligibility = (
  airdropId: string | undefined,
  claimantData: ClaimableAirdropItem | null | undefined,
) => {
  const { wallet, publicKey } = useWallet()
  const walletAddress = publicKey?.toBase58()

  return useQuery<ClaimEligibilityData>({
    queryKey: [QUERY_KEYS.getClaimEligibility, { airdropId, walletAddress }],
    queryFn: async () => {
      if (!airdropId || !walletAddress || !claimantData || !wallet) {
        return { userEligible: false, userClaimed: false }
      }

      if (!claimantData.distributorAddress) {
        return { userEligible: false, userClaimed: false }
      }

      try {
        const ixs = await prepareClaimInstructions(
          {
            amountLocked: new BN(claimantData.amountLocked),
            amountUnlocked: new BN(claimantData.amountUnlocked),
            id: claimantData.distributorAddress,
            proof: claimantData.proof,
          },
          wallet,
        )

        return {
          userEligible: !!ixs,
          userClaimed: !ixs,
        }
      } catch (error) {
        console.error('Error checking claim eligibility:', error)
        return { userEligible: false, userClaimed: false }
      }
    },
    enabled: !!airdropId && !!walletAddress && !!claimantData && !!wallet,
  })
}
