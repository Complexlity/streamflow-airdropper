import { useNavigate } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useTokenMetadata, useTokenPrice } from '@/hooks/token/useTokenMetadata'
import { formatAddress, formatTokenAmount, formatUsdValue } from '@/utils/format'
import { calculateProgress } from '@/utils/calculations'
import type { AirdropSearchResultItem } from '@/types/airdrop'
import { TokenMetadata } from '@/types'

interface AirdropCardProps {
  airdrop: AirdropSearchResultItem
}

/**
 * Displays an airdrop in a card format with token information and progress
 */
export const AirdropCard = ({ airdrop }: AirdropCardProps) => {
  const navigate = useNavigate()
  const { data: token, isLoading: isLoadingToken } = useTokenMetadata(airdrop.mint)
  const { data: tokenPrice } = useTokenPrice(airdrop.mint)
  const progress = calculateProgress(airdrop.totalAmountUnlocked, airdrop.maxTotalClaim)

  const handleCardClick = () => {
    navigate(`/airdrop/${airdrop.address}`)
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{airdrop.name}</CardTitle>
            <p className="text-sm text-muted-foreground">ID: {formatAddress(airdrop.address)}</p>
          </div>
          <Badge variant={airdrop.totalAmountLocked == '0' ? 'default' : 'secondary'}>
            {airdrop.totalAmountLocked !== '0' ? 'Instant' : 'Vested'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <TokenDisplay token={token} mint={airdrop.mint} isLoading={isLoadingToken} />
        <AirdropAmounts airdrop={airdrop} token={token} tokenPrice={tokenPrice} />
      </CardContent>

      <CardFooter>
        <ProgressDisplay progress={progress} />
      </CardFooter>
    </Card>
  )
}

interface TokenDisplayProps {
  mint: string
  token: TokenMetadata | null | undefined
  isLoading: boolean
}
// Sub-components for better organization
function TokenDisplay({ token, mint, isLoading }: TokenDisplayProps) {
  if (isLoading) return <div className="h-5 animate-pulse bg-gray-200 rounded w-24" />

  return (
    <div className="flex items-center gap-2 mb-2">
      {token ? (
        <div className="flex items-center gap-2">
          <img src={token.image || '/placeholder.svg'} alt={token.symbol} className="w-5 h-5 rounded-full" />
          <span className="font-medium">{token.symbol}</span>
        </div>
      ) : (
        <span className="font-medium">{formatAddress(mint)}</span>
      )}
    </div>
  )
}

interface AirdropAmountsProps {
  airdrop: AirdropSearchResultItem
  token: TokenMetadata | null | undefined
  tokenPrice: number | undefined
}

function AirdropAmounts({ airdrop, token, tokenPrice }: AirdropAmountsProps) {
  return (
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
  )
}

function ProgressDisplay({ progress }: { progress: number }) {
  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-xs">
        <span>Progress</span>
        <span>{progress.toFixed(0)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}
