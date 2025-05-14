"use client"

import { useNavigate } from "react-router"
import type { AirdropSearchResultItem, Token } from "@/lib/types"
import { calculateProgress, formatAddress, formatTokenAmount, formatUsdValue } from "./utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface AirdropCardProps {
  airdrop: AirdropSearchResultItem
  token?: Token
}

export function AirdropCard({ airdrop, token }: AirdropCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/airdrop/${airdrop.address}`)
  }

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
              <img src={token.logoURI || "/placeholder.svg"} alt={token.symbol} className="w-5 h-5 rounded-full" />
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
              {token && (
                <span className="text-muted-foreground ml-1">
                  ({formatUsdValue(airdrop.totalAmountUnlocked, token.decimals, token.price)})
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
