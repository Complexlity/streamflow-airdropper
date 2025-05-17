//Types were most generated from api results
export interface TokenMetadata {
  address: string
  name: string
  symbol: string
  decimals: number
  supply: string
  uri: string | null
  image: string
}

export interface PriceResult {
  data: Record<string, PriceData>
}

export interface PriceData {
  value: number
  updateUnixTime: number
  volumeUSD: number
  priceChangePercent: number
  volumeChangePercent: number
  source: string
}

export interface TokenBalance {
  mint: string
  amount: number
  name: string
  symbol: string
  decimals: number
  image: string
}

export interface WalletTokenBalances {
  sol: number
  tokens: TokenBalance[]
}
