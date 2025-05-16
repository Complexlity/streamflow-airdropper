"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { getAirdropById, getClaimantByAddress } from "@/lib/queries"
import { distributorClient } from "@/lib/services"
import { AirdropCreateData, ClaimableAirdropItem } from "@/lib/types"
import { useWallet, Wallet, } from '@solana/wallet-adapter-react'
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query"
import BN from "bn.js"
import { AlertCircle, ArrowLeft, Calendar, CheckCircle, Users } from "lucide-react"
import { useNavigate, useParams } from "react-router"
import { toast } from "sonner"
import {
  calculateProgress,
  formatAddress,
  formatDate,
  formatTokenAmount,
  formatUsdValue
} from "./utils"
import { useEffect } from "react"
import { LAMPORTS_PER_SOL_DECIMALS } from "@/lib/constants"
import { fetchTokenPrice } from "./mock-data"
import { useTransactionToast } from "@/hooks/use-transaction-toast"

export function AirdropDetailView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = new QueryClient()

  const { wallet, publicKey } = useWallet()
  const userAddress = publicKey?.toBase58()

  const {
    data: airdrop,
    isLoading: isLoadingAirdropById,
    error
  } = useQuery({
    queryKey: ['airdrop', id],
    queryFn: async () => {
      if (!id) return null
      return await getAirdropById(id)
    },
    enabled: !!id,
  })
  if (airdrop) {
    airdrop.tokenDecimals = airdrop?.tokenDecimals || LAMPORTS_PER_SOL_DECIMALS
  }


  const { data: claimantData, isLoading: isLoadingClaimant } = useQuery({
    queryKey: ['claimant', { id, userAddress }],
    queryFn: async () => {
      if (!id || !userAddress) return null
      return await getClaimantByAddress(id, userAddress).catch(() => null)
    },
    enabled: !!id && !!userAddress,
  })

  const defaultEligiblity = { userEligible: false, userClaimed: false }
  const { data, isLoading: isLoadingEligibility, refetch: refetchEligibility } = useQuery({
    queryKey: ['eligibility', { user: publicKey?.toBase58(), distributor: id }],
    queryFn: async () => {

      if (!id || !userAddress || !claimantData) return defaultEligiblity
      if (!claimantData.distributorAddress) return defaultEligiblity
      console.log("Trying to prepare transaction...")

      const ixs = await distributorClient.prepareClaimInstructions({
        amountLocked: new BN(claimantData.amountLocked),
        amountUnlocked: new BN(claimantData.amountUnlocked),
        id: claimantData.distributorAddress,
        proof: claimantData.proof
      },
        {
          //@ts-expect-error: wallet is okay
          invoker: wallet?.adapter
        }).catch(e => {
          console.error(e)
          if (e.message === "invalid account discriminator") {
            console.log("Cannot claim airdrop")
            return { userEligible: false, userClaimed: true }
          }
          return defaultEligiblity
        })
      return { userEligible: !!ixs, userClaimed: !ixs }
    },
    enabled: !!id && !!userAddress && !!claimantData
  })

  const { userEligible, userClaimed } = data || defaultEligiblity


  const { mutate: claimMutation, isSuccess, isPending: isClaimMutating } = useClaimMutation(distributorClient, wallet, claimantData, airdrop)



  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({
        queryKey: ['eligibility', { user: publicKey?.toBase58(), distributor: id }],
      })
      refetchEligibility()
    }
  }, [isSuccess])


  const {
    data: tokenPrice,
  } = useQuery({
    queryKey: ['tokenPrice', airdrop?.mint],
    queryFn: async () => {
      if (!airdrop?.mint) return 0
      return await fetchTokenPrice(airdrop.mint)
    },
    enabled: !!airdrop?.mint,
  })

  if (tokenPrice && airdrop) {
    airdrop.usdValue = tokenPrice
  }

  if (isLoadingAirdropById) {
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
            {error instanceof Error ? error.message : "Airdrop not found"}
            <div className="mt-4">
              <Button onClick={() => navigate("/")}>Go to Home</Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const claimedProgress = calculateProgress(airdrop.totalAmountUnlocked, airdrop.maxTotalClaim)


  const userClaimableAmount = claimantData?.amountLocked


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{airdrop.name}</h1>
          <Badge variant={airdrop.isActive ? "default" : "secondary"}>
            {airdrop.isActive ? "Active" : "Inactive"}
          </Badge>
          <Badge variant="outline">{airdrop.type || "Instant"}</Badge>
        </div>

        {userEligible && airdrop.isActive && !userClaimed && Number(userClaimableAmount) && (
          <Button
            onClick={() => claimMutation()}
            disabled={isClaimMutating}
            className="w-full sm:w-auto"
          >
            {isClaimMutating ? "Claiming..." : "Claim Tokens"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Airdrop Details</CardTitle>
            <CardDescription>ID: {formatAddress(airdrop.address)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {airdrop.name} ({airdrop.tokenSymbol || "????"})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-medium">
                  {formatTokenAmount(airdrop.maxTotalClaim, airdrop.tokenDecimals!)} {airdrop.tokenSymbol}
                </p>
                {airdrop.usdValue !== undefined && (
                  <p className="text-xs text-muted-foreground">
                    {formatUsdValue(airdrop.maxTotalClaim, airdrop.tokenDecimals!, airdrop.usdValue)}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Claimed Amount</p>
                <p className="font-medium">
                  {formatTokenAmount(airdrop.totalAmountUnlocked, airdrop.tokenDecimals!)} {airdrop.tokenSymbol}
                </p>
                {airdrop.usdValue !== undefined && (
                  <p className="text-xs text-muted-foreground">
                    {formatUsdValue(airdrop.totalAmountUnlocked, airdrop.tokenDecimals!, airdrop.usdValue)}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Sender</p>
                <p className="font-medium">{formatAddress(airdrop.sender)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Token Address</p>
                <p className="font-medium">{formatAddress(airdrop.mint)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Chain</p>
                <p className="font-medium">{airdrop.chain}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="flex gap-2">
                  <Badge variant={airdrop.isOnChain ? "outline" : "secondary"}>
                    {airdrop.isOnChain ? "On-Chain" : "Off-Chain"}
                  </Badge>
                  {airdrop.isVerified && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Claimed Progress</span>
                <span>{claimedProgress.toFixed(0)}%</span>
              </div>
              <Progress value={claimedProgress} className="h-2" />
            </div>

            {airdrop.recipientsClaimed !== undefined && airdrop.totalRecipients !== undefined && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>
                  {airdrop.recipientsClaimed} / {airdrop.totalRecipients} recipients claimed
                </span>
              </div>
            )}

            {airdrop.clawbackDt && (
              <div>
                <p className="text-sm text-muted-foreground">Clawback Date</p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <p className="text-sm">{formatDate(Number(airdrop.clawbackDt))}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Allocation</CardTitle>
            <CardDescription>
              {isLoadingClaimant
                ? "Checking if you're eligible to claim..."
                : isLoadingEligibility
                  ? "You are eligible. Checking if you can claim..."
                  : userEligible
                    ? userClaimed
                      ? "You have already claimed this airdrop"
                      : "You are eligible for this airdrop"
                    : "You are not eligible for this airdrop"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingEligibility || isLoadingClaimant ? (
              <Skeleton className="h-10 w-full" />
            ) : userEligible ? (
              userClaimed || !Number(userClaimableAmount) ? (
                <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertTitle className="text-blue-600 dark:text-blue-400">Already Claimed</AlertTitle>
                  <AlertDescription className="text-blue-600/90 dark:text-blue-400/90">
                    You have already claimed your tokens for this airdrop.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Your Claimable Amount</p>
                    <p className="text-2xl font-bold">
                      {formatTokenAmount(userClaimableAmount || "0", airdrop.tokenDecimals!)}{" "}
                      {airdrop.tokenSymbol}
                    </p>
                    {airdrop.usdValue !== undefined && (
                      <p className="text-sm text-muted-foreground">
                        {formatUsdValue(
                          userClaimableAmount || "0",
                          airdrop.tokenDecimals!,
                          airdrop.usdValue
                        )}
                      </p>
                    )}
                  </div>

                  <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertTitle className="text-green-600 dark:text-green-400">Ready to claim</AlertTitle>
                    <AlertDescription className="text-green-600/90 dark:text-green-400/90">
                      You can claim your tokens now
                    </AlertDescription>
                  </Alert>
                </>
              )
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


export const useClaimMutation = (client: typeof distributorClient, wallet: Wallet | null, claimantData: ClaimableAirdropItem | null | undefined, airdrop: AirdropCreateData | null | undefined) => {

  const showTxToast = useTransactionToast();

  return useMutation({
    mutationFn: async () => {
      if (!airdrop || !wallet || !wallet.adapter.connected || !claimantData || !claimantData.distributorAddress) {
        throw new Error("Required data or connections missing");
      }

      const claimingData = {
        amountLocked: new BN(claimantData.amountLocked),
        amountUnlocked: new BN(claimantData.amountUnlocked),
        id: claimantData.distributorAddress,
        proof: claimantData.proof
      }

      const ixs = await client.claim(claimingData, {
        //@ts-expect-error: this works
        invoker: wallet.adapter
      });

      return ixs;
    },
    onSuccess: (data) => {
      if (data?.txId) {
        showTxToast(data.txId);
      } else {
        toast.success("Successfully claimed tokens!");
      }
    },
    onError: (error) => {
      toast.error("Error claiming tokens");
      console.error(error);
    }
  });
};