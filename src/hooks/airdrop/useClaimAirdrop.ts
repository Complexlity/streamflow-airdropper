"use client"

import { QUERY_KEYS } from "@/config/constants"
import { claimAirdrop } from "@/services/blockchain/streamflowService"
import { handleApiError } from "@/utils/errors"
import { useWallet } from "@solana/wallet-adapter-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { BN } from "bn.js"
import { useTransactionToast as useToast } from "../useTransactionToast"

export const useClaimAirdrop = () => {
    const { wallet } = useWallet()
    const queryClient = useQueryClient()
    const showTransactionToast = useToast()

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
                throw new Error("Wallet not connected")
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
            if (data?.txId) {
                showTransactionToast(data.txId)
            }

            // Invalidate relevant queries
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.getClaimableAirdrop],
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.getAirdropById, variables.distributorAddress],
            })
        },
        onError: (error) => {
            handleApiError(error, "Failed to claim airdrop")
        },
    })
}

