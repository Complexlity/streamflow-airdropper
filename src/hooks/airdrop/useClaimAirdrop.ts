import { QUERY_KEYS } from '@/config/constants'
import { claimAirdrop } from '@/services/blockchain/streamflowService'
import type { Wallet } from '@solana/wallet-adapter-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BN } from 'bn.js'

interface ClaimAirdropOptions {
  onSuccess?: (data: Awaited<ReturnType<typeof claimAirdrop>>, variables: unknown) => void
  onError?: (error: unknown) => void
}

export const useClaimAirdrop = (wallet: Wallet | null, options: ClaimAirdropOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      distributorAddress,
      amountLocked,
      amountUnlocked,
      proof,
    }: {
      distributorAddress: string
      amountLocked: string
      amountUnlocked: string
      proof: number[][]
    }) => {
      if (!wallet || !wallet.adapter.connected) {
        throw new Error('Wallet not connected')
      }

      const claimingData = {
        amountLocked: new BN(amountLocked),
        amountUnlocked: new BN(amountUnlocked),
        id: distributorAddress,
        proof,
      }

      return claimAirdrop(claimingData, wallet)
    },
    onSuccess: (data, variables) => {
      
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getClaimableAirdrop],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getAirdropById, variables.distributorAddress],
      })

      if (options.onSuccess) {
        options.onSuccess(data, variables)
      }
    },
    onError: (error) => {
      if (options.onError) {
        options.onError(error)
      }
    },
  })
}
