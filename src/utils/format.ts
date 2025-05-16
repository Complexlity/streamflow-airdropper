/**
 * Format token amount based on decimals
 * @param amount Amount as string
 * @param decimals Token decimals
 * @returns Formatted amount
 */
export const formatTokenAmount = (amount: string, decimals: number): string => {
  const value = BigInt(amount)
  const divisor = BigInt(10) ** BigInt(decimals)
  const integerPart = value / divisor
  const fractionalPart = value % divisor

  let fractionalStr = fractionalPart.toString().padStart(decimals, "0")
  // Trim trailing zeros
  fractionalStr = fractionalStr.replace(/0+$/, "")

  if (fractionalStr === "") {
    return integerPart.toString()
  }

  return `${integerPart}.${fractionalStr}`
}

/**
 * Format USD value
 * @param tokenAmount Token amount as string
 * @param decimals Token decimals
 * @param price Token price in USD
 * @returns Formatted USD value
 */
export const formatUsdValue = (tokenAmount: string, decimals: number, price: number): string => {
  const amount = Number.parseFloat(formatTokenAmount(tokenAmount, decimals))
  const usdValue = amount * price

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdValue)
}

/**
 * Format date from timestamp
 * @param timestamp Unix timestamp in seconds
 * @returns Formatted date string
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString()
}

/**
 * Format address for display (truncate middle)
 * @param address Full address
 * @returns Truncated address
 */
export const formatAddress = (address: string): string => {
  if (!address) return ""
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}
