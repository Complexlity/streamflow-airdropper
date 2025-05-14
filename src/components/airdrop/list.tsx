"use client"

import { useEffect, useState } from "react"
import { fetchAirdropsMock, fetchClaimableAirdropsMock, fetchTokensInWalletMock } from "./mock-data"
import type { AirdropSearchResultItem, Token } from "@/lib/types"
import { AirdropCard } from "./card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

export function AirdropList() {
  const [loading, setLoading] = useState(true)
  const [allAirdrops, setAllAirdrops] = useState<AirdropSearchResultItem[]>([])
  const [claimableAirdrops, setClaimableAirdrops] = useState<AirdropSearchResultItem[]>([])
  const [tokens, setTokens] = useState<Token[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [allResult, claimableResult, tokensResult] = await Promise.all([
          fetchAirdropsMock(),
          fetchClaimableAirdropsMock(),
          fetchTokensInWalletMock(),
        ])

        setAllAirdrops(allResult.items)
        setClaimableAirdrops(claimableResult.items)
        setTokens(tokensResult)
      } catch (error) {
        console.error("Error fetching airdrops:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[200px] w-full" />
            ))}
          </div>
        ) : (
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
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[200px] w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {claimableAirdrops.length > 0 ? (
              claimableAirdrops.map((airdrop) => (
                <AirdropCard key={airdrop.address} airdrop={airdrop} token={getTokenForAirdrop(airdrop)} />
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
