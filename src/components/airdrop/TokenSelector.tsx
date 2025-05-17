import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useTokenBalances } from '@/hooks/token/useTokenBalances'
import { Skeleton } from '@/components/ui/skeleton'

interface TokenSelectorProps {
  value: string
  onChange: (value: string) => void
}

/**
 * Component for selecting a token from wallet balances
 */
export const TokenSelector = ({ value, onChange }: TokenSelectorProps) => {
  const { data: tokenBalances, isLoading } = useTokenBalances()

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Select Token</Label>
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="token">Select Token</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a token" />
        </SelectTrigger>
        <SelectContent>
          {/* SOL option */}
          <SelectItem value="native">
            <div className="flex items-center gap-2">
              <img
                src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
                alt="SOL"
                className="w-4 h-4 rounded-full"
              />
              <span>SOL - {tokenBalances ? tokenBalances.sol : 0}</span>
            </div>
          </SelectItem>

          {/* SPL tokens */}
          {tokenBalances?.tokens?.map((token) => (
            <SelectItem key={token.mint} value={token.mint}>
              <div className="flex items-center gap-2">
                <img src={token.image || '/placeholder.svg'} alt={token.symbol} className="w-4 h-4 rounded-full" />
                <span>
                  {token.name.trim().startsWith('Wrapped') ? `W${token.symbol}` : token.symbol} - {token.amount}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
