"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Token } from "@/lib/types"
import { AirdropSearchResultItem } from "@/lib/types"
import { useNavigate } from "react-router"
import { calculateProgress, formatAddress, formatTokenAmount, formatUsdValue } from "./utils"
import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/lib/constants"
import { } from "@/lib/queries"
import { fetchTokenPrice, getTokenMetadata } from "./mock-data"
import { cluster } from "@/lib/services"


interface AirdropCardProps {
  airdrop: AirdropSearchResultItem

  token?: Token
}

export function AirdropCard({ airdrop }: AirdropCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/airdrop/${airdrop.address}`)
  }

  const { data: token } = useQuery({
    queryKey: [QUERY_KEYS.getTokenMetadata, { address: airdrop.mint }],
    queryFn: async () => {
      if (!airdrop.mint) return null
      return await getTokenMetadata(airdrop.mint, cluster)
    },
    enabled: !!airdrop.mint,
  })

  const { data: tokenPrice } = useQuery({
    queryKey: [QUERY_KEYS.getTokenMetadata, { address: airdrop.mint }],
    queryFn: async () => {
      if (!airdrop.mint) return null
      return await fetchTokenPrice(airdrop.mint)
    },
    enabled: !!airdrop.mint,
  })

  const progress = calculateProgress(airdrop.totalAmountUnlocked, airdrop.maxTotalClaim)

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{airdrop.name}</CardTitle>
            <CardDescription>ID: {formatAddress(airdrop.address)}</CardDescription>
          </div>
          <Badge variant={airdrop.isActive ? "default" : "secondary"}>{airdrop.isActive ? "Active" : "Inactive"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-2 mb-2">
          {token && (
            <div className="flex items-center gap-2">
              <img src={token.image || "/placeholder.svg"} alt={token.symbol} className="w-5 h-5 rounded-full" />
              <span className="font-medium">{token.symbol}</span>
            </div>
          )}
          {!token && <span className="font-medium">{formatAddress(airdrop.mint)}</span>}
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Amount:</span>
            <span className="font-medium">
              {token ? formatTokenAmount(airdrop.maxTotalClaim, token.decimals) : airdrop.maxTotalClaim}
              {token && ` ${token.symbol}`}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Claimed:</span>
            <span className="font-medium">
              {token ? formatTokenAmount(airdrop.totalAmountUnlocked, token.decimals) : airdrop.totalAmountUnlocked}
              {token && ` ${token.symbol}`}
              {token && tokenPrice && (
                <span className="text-muted-foreground ml-1">
                  ({formatUsdValue(airdrop.totalAmountUnlocked, token.decimals, tokenPrice)})
                </span>
              )}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full space-y-1">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardFooter>
    </Card>
  )
}
