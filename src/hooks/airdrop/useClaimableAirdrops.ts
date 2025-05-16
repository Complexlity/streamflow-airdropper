"use client"

import { QUERY_KEYS } from "@/config/constants"
import {
    getAirdropById,
    getClaimableAirdrops
} from "@/services/api/airdropService"
import { useWallet } from "@solana/wallet-adapter-react"
import { useQuery } from "@tanstack/react-query"

/**
 * Hook for fetching claimable airdrops
 */
export const useClaimableAirdrops = () => {
    const { publicKey, connected } = useWallet()
    const walletAddress = publicKey?.toBase58()

    return useQuery({
        queryKey: [QUERY_KEYS.getClaimableAirdrop, walletAddress],
        queryFn: async () => {
            if (!walletAddress) return null
            const claimable = await getClaimableAirdrops(walletAddress)
            if (!Array.isArray(claimable)) return []

            //Claimable query does not return required results so we also get by Id 
            const details = await Promise.all(
                claimable.map(async (item: Awaited<ReturnType<typeof getClaimableAirdrops>>[number]) => {
                    const airdrop = await getAirdropById(item.distributorAddress)
                    return { ...item, ...airdrop }
                })
            )
            return details
        },
        enabled: !!walletAddress && connected,
    })
}
