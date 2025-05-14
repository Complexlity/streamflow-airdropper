"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { claimAirdropMock, fetchAirdropByIdMock } from "./mock-data"
import type { AirdropDetail } from "@/lib/types"
import {
  calculateProgress,
  calculateVestingProgress,
  formatAddress,
  formatDate,
  formatTokenAmount,
  formatUsdValue,
} from "./utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, ArrowLeft, Calendar, CheckCircle, Clock, Users } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"

export function AirdropDetailView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [airdrop, setAirdrop] = useState<AirdropDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAirdrop = async () => {
      if (!id) return

      setLoading(true)
      setError(null)

      try {
        const result = await fetchAirdropByIdMock(id)
        if (result) {
          setAirdrop(result)
        } else {
          setError("Airdrop not found")
        }
      } catch (err) {
        setError("Failed to load airdrop details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAirdrop()
  }, [id])

  const handleClaim = async () => {
    if (!airdrop) return

    setClaiming(true)
    try {
      const result = await claimAirdropMock(airdrop.address)
      if (result.success) {
        toast.success("Successfully claimed tokens!", {
          description: `Transaction ID: ${result.txId}`,
        })
      } else {
        toast.error("Failed to claim tokens")
      }
    } catch (err) {
      toast.error("Error claiming tokens")
      console.error(err)
    } finally {
      setClaiming(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-10 w-64" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (error || !airdrop) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Airdrop not found"}
            <div className="mt-4">
              <Button onClick={() => navigate("/")}>Go to Home</Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const claimedProgress = calculateProgress(airdrop.claimedAmount, airdrop.maxTotalClaim)
  const vestingProgress = airdrop.type === "Vested" ? calculateVestingProgress(airdrop) : 100

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{airdrop.name}</h1>
          <Badge variant={airdrop.isActive ? "default" : "secondary"}>{airdrop.isActive ? "Active" : "Inactive"}</Badge>
          <Badge variant="outline">{airdrop.type}</Badge>
        </div>

        {airdrop.userEligible && airdrop.isActive && (
          <Button onClick={handleClaim} disabled={claiming} className="w-full sm:w-auto">
            {claiming ? "Claiming..." : "Claim Tokens"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Airdrop Details</CardTitle>
            <CardDescription>ID: {airdrop.address}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src={airdrop.tokenLogo || "/placeholder.svg"}
                alt={airdrop.tokenSymbol}
                className="w-6 h-6 rounded-full"
              />
              <span className="font-medium">
                {airdrop.tokenName} ({airdrop.tokenSymbol})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-medium">
                  {formatTokenAmount(airdrop.maxTotalClaim, airdrop.tokenDecimals)} {airdrop.tokenSymbol}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatUsdValue(airdrop.maxTotalClaim, airdrop.tokenDecimals, airdrop.tokenPrice)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Claimed Amount</p>
                <p className="font-medium">
                  {formatTokenAmount(airdrop.claimedAmount, airdrop.tokenDecimals)} {airdrop.tokenSymbol}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatUsdValue(airdrop.claimedAmount, airdrop.tokenDecimals, airdrop.tokenPrice)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Sender</p>
                <p className="font-medium">{formatAddress(airdrop.sender)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Token Address</p>
                <p className="font-medium">{formatAddress(airdrop.mint)}</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Claimed Progress</span>
                <span>{claimedProgress.toFixed(0)}%</span>
              </div>
              <Progress value={claimedProgress} className="h-2" />
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {airdrop.claimedCount} / {airdrop.totalRecipients} recipients claimed
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Allocation</CardTitle>
            <CardDescription>
              {airdrop.userEligible ? "You are eligible for this airdrop" : "You are not eligible for this airdrop"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {airdrop.userEligible ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Your Claimable Amount</p>
                  <p className="text-2xl font-bold">
                    {formatTokenAmount(airdrop.userClaimableAmount, airdrop.tokenDecimals)} {airdrop.tokenSymbol}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatUsdValue(airdrop.userClaimableAmount, airdrop.tokenDecimals, airdrop.tokenPrice)}
                  </p>
                </div>

                {airdrop.type === "Vested" && (
                  <>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Vesting Progress</span>
                        <span>{vestingProgress.toFixed(0)}%</span>
                      </div>
                      <Progress value={vestingProgress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Start Date</p>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm">{formatDate(airdrop.startVestingTs)}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">End Date</p>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm">{formatDate(airdrop.endVestingTs)}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Unlock Interval</p>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm capitalize">{airdrop.unlockInterval}</p>
                        </div>
                      </div>

                      {airdrop.cliffAmount && (
                        <div>
                          <p className="text-sm text-muted-foreground">Cliff Amount</p>
                          <p className="text-sm">
                            {formatTokenAmount(airdrop.cliffAmount, airdrop.tokenDecimals)} {airdrop.tokenSymbol}
                            {airdrop.cliffPercentage && ` (${airdrop.cliffPercentage}%)`}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle className="text-green-600 dark:text-green-400">Ready to claim</AlertTitle>
                  <AlertDescription className="text-green-600/90 dark:text-green-400/90">
                    You can claim your tokens now
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Not eligible</AlertTitle>
                <AlertDescription>You are not eligible for this airdrop</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
