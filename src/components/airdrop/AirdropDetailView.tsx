import { useParams, useNavigate } from 'react-router'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useAirdropDetails } from '@/hooks/airdrop/useAirdropDetails'
import { useClaimantData } from '@/hooks/airdrop/useClaimant'
import { useClaimEligibility } from '@/hooks/airdrop/useClaimEligibility'
import { useClaimAirdrop } from '@/hooks/airdrop/useClaimAirdrop'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import type { AirdropCreateData, ClaimableAirdropItem, ClaimEligibilityData } from '@/types/airdrop'
import { useTokenMetadata, useTokenPrice } from '@/hooks/token/useTokenMetadata'
import { Progress } from '@/components/ui/progress'
import { Calendar, Users } from 'lucide-react'
import { formatAddress, formatTokenAmount, formatUsdValue, formatDate } from '@/utils/format'
import { calculateProgress } from '@/utils/calculations'
import { useWallet } from '@solana/wallet-adapter-react'
import { CopyButton } from '../ui/copy-button'

export function AirdropDetailView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { publicKey } = useWallet()
  const walletAddress = publicKey?.toBase58()

  const { data: airdrop, isLoading: isLoadingAirdrop, error: airdropError } = useAirdropDetails(id)

  const { data: claimantData, isLoading: isLoadingClaimant } = useClaimantData(id, walletAddress)

  const { data: eligibilityData, isLoading: isLoadingEligibility } = useClaimEligibility(id, claimantData)
  const userClaimableAmount = claimantData?.amountLocked || '0'

  const { mutate: claimAirdrop, isPending: isClaimPending } = useClaimAirdrop()

  const handleClaim = () => {
    if (!id || !claimantData) return

    claimAirdrop({
      distributorAddress: id,
      amountLocked: claimantData.amountLocked,
      amountUnlocked: claimantData.amountUnlocked,
      proof: claimantData.proof,
    })
  }

  if (isLoadingAirdrop) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-10 w-64" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (airdropError || !airdrop) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {airdropError instanceof Error ? airdropError.message : 'Airdrop not found'}
            <div className="mt-4">
              <Button onClick={() => navigate('/')}>Go to Home</Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{airdrop.name}</h1>
          <Badge variant={airdrop.isActive ? 'default' : 'secondary'}>{airdrop.isActive ? 'Active' : 'Inactive'}</Badge>
          <Badge variant="outline">{airdrop.type || 'Instant'}</Badge>
        </div>

        {eligibilityData?.userEligible &&
          airdrop.isActive &&
          !eligibilityData.userClaimed &&
          !!Number(userClaimableAmount) && (
            <Button onClick={handleClaim} disabled={isClaimPending} className="w-full sm:w-auto">
              {isClaimPending ? 'Claiming...' : 'Claim Tokens'}
            </Button>
          )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AirdropInfoCard airdrop={airdrop} />

        <UserAllocationCard
          airdrop={airdrop}
          claimantData={claimantData}
          eligibilityData={eligibilityData}
          isLoading={isLoadingClaimant || isLoadingEligibility}
        />
      </div>
    </div>
  )
}
interface AirdropInfoCardProps {
  airdrop: AirdropCreateData
}

function AirdropInfoCard({ airdrop }: AirdropInfoCardProps) {
  const { data: token } = useTokenMetadata(airdrop.mint)
  const { data: tokenPrice } = useTokenPrice(airdrop.mint)
  const claimedProgress = calculateProgress(airdrop.totalAmountUnlocked, airdrop.maxTotalClaim)

  const tokenDecimals = token?.decimals || airdrop.tokenDecimals || 9

  const totalRecipients = Number(airdrop.maxNumNodes)
  const claimedRecipients =
    totalRecipients > 0
      ? Math.round((Number(airdrop.totalAmountUnlocked) / Number(airdrop.maxTotalClaim)) * totalRecipients)
      : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Airdrop Details</CardTitle>
        <CardDescription>
          ID: {formatAddress(airdrop.address)}
          <CopyButton text={airdrop.address} />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {airdrop.name} ({token?.symbol || airdrop.tokenSymbol || '????'})
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="font-medium">
              {formatTokenAmount(airdrop.maxTotalClaim, tokenDecimals)} {token?.symbol || airdrop.tokenSymbol}
            </p>
            {tokenPrice !== undefined && (
              <p className="text-xs text-muted-foreground">
                {formatUsdValue(airdrop.maxTotalClaim, tokenDecimals, tokenPrice)}
              </p>
            )}
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Claimed Amount</p>
            <p className="font-medium">
              {formatTokenAmount(airdrop.totalAmountUnlocked, tokenDecimals)} {token?.symbol || airdrop.tokenSymbol}
            </p>
            {tokenPrice !== undefined && (
              <p className="text-xs text-muted-foreground">
                {formatUsdValue(airdrop.totalAmountUnlocked, tokenDecimals, tokenPrice)}
              </p>
            )}
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Total Recipients</p>
            <p className="font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />

              {totalRecipients}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Claimed Recipients</p>
            <p className="font-medium">
              {claimedRecipients} / {totalRecipients}
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

          <div>
            <p className="text-sm text-muted-foreground">Chain</p>
            <p className="font-medium">{airdrop.chain}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <div className="flex gap-2">
              <Badge variant={airdrop.isOnChain ? 'outline' : 'secondary'}>
                {airdrop.isOnChain ? 'On-Chain' : 'Off-Chain'}
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
  )
}

interface UserAllocationCardProps {
  airdrop: AirdropCreateData
  claimantData: ClaimableAirdropItem | null | undefined
  eligibilityData: ClaimEligibilityData | undefined
  isLoading: boolean
}

function UserAllocationCard({ airdrop, claimantData, eligibilityData, isLoading }: UserAllocationCardProps) {
  const { data: token } = useTokenMetadata(airdrop.mint)
  const { data: tokenPrice } = useTokenPrice(airdrop.mint)

  const tokenDecimals = token?.decimals || airdrop.tokenDecimals || 9
  const userClaimableAmount = claimantData?.amountLocked || '0'

  const { userEligible, userClaimed } = eligibilityData || { userEligible: false, userClaimed: false }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Allocation</CardTitle>
        <CardDescription>
          {isLoading
            ? "Checking if you're eligible to claim..."
            : userEligible
              ? userClaimed
                ? 'You have already claimed this airdrop'
                : 'You are eligible for this airdrop'
              : 'You are not eligible for this airdrop'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
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
                  {formatTokenAmount(userClaimableAmount, tokenDecimals)} {token?.symbol || airdrop.tokenSymbol}
                </p>
                {tokenPrice !== undefined && (
                  <p className="text-sm text-muted-foreground">
                    {formatUsdValue(userClaimableAmount, tokenDecimals, tokenPrice)}
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
  )
}
