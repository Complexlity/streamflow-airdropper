"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QUERY_KEYS } from "@/lib/constants"
import { getAirdropById, getAllAirdrops, getClaimableAirdrops } from "@/lib/queries"
import type { AirdropSearchResultItem, Token } from "@/lib/types"
import { useWallet } from "@solana/wallet-adapter-react"
import { QueryClient, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { AirdropCard } from "./card"

export function AirdropList() {
  const { publicKey, connected } = useWallet()
  const account = {
    address: publicKey?.toBase58()
  }
  const userAddress = publicKey?.toBase58()
  const queryClient = new QueryClient()

  const [tokens, setTokens] = useState<Token[]>([])

  const { data: allAirdrops, isLoading: isLoadingAllAirdrops } = useQuery({
    queryKey: [QUERY_KEYS.getAirdrops],
    queryFn: getAllAirdrops
  })

  const { data: mainClaimableAirdrops, isLoading: isLoadingClaimableAirdrops } = useQuery({
    queryKey: [QUERY_KEYS.getClaimableAirdrop, account?.address],
    queryFn: async () => {
      if (!userAddress || !connected) return null
      const claimableAirdrops = await getClaimableAirdrops(userAddress)

      const detailedAirdrops = await Promise.all(
        claimableAirdrops.map(async (airdrop) => {
          const detailedAirdrop = await getAirdropById(airdrop.distributorAddress)
          queryClient.setQueryData(["airdrop", airdrop.distributorAddress], detailedAirdrop)
          return { ...airdrop, ...detailedAirdrop }
        })
      )

      return detailedAirdrops
    },
    enabled: !!userAddress && connected
  })




  const getTokenForAirdrop = (airdrop: AirdropSearchResultItem) => {
    return tokens.find((token) => token.address === airdrop.mint)
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="all">All Airdrops</TabsTrigger>
        <TabsTrigger value="claimable">Claimable</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-0">
        {isLoadingAllAirdrops ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[200px] w-full" />
            ))}
          </div>
        ) :
          !allAirdrops || allAirdrops.length === 0 ?
            <div className="col-span-full text-center py-8">No airdrops found</div>
            :
            (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allAirdrops.length > 0 ? (
                  allAirdrops.map((airdrop) => (
                    <AirdropCard key={airdrop.address} airdrop={airdrop} token={getTokenForAirdrop(airdrop)} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">No airdrops found</div>
                )}
              </div>
            )}
      </TabsContent>

      <TabsContent value="claimable" className="mt-0">
        {isLoadingClaimableAirdrops ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[200px] w-full" />
            ))}
          </div>
        ) :
          !mainClaimableAirdrops ? (
            <div className="col-span-full text-center py-8">Wallet not connected</div>
          )
            : mainClaimableAirdrops.length === 0 ? (
              <div className="col-span-full text-center py-8">No claimable airdrops found</div>
            ) :
              (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mainClaimableAirdrops.length > 0 ? (
                    mainClaimableAirdrops.map((airdrop) => (
                      <AirdropCard key={airdrop.distributorAddress} airdrop={airdrop} token={getTokenForAirdrop(airdrop)} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">No claimable airdrops found</div>
                  )}
                </div>
              )}
      </TabsContent>
    </Tabs>
  )
}


