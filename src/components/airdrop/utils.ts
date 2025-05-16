import type { AirdropDetail, AirdropSearchResultItem, Token } from "@/lib/types"

// Format token amount based on decimals
export const formatTokenAmount = (amount: string, decimals: number): string => {
    console.log({ amount, decimals })
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

// Format USD value
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

// Format date
export const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString()
}

// Calculate progress percentage
export const calculateProgress = (claimed: string, total: string): number => {
    if (total === "0") return 0
    return (Number(claimed) / Number(total)) * 100
}

// Format address for display
export const formatAddress = (address: string): string => {
    if (!address) return ""
    return `${address.slice(0, 4)}...${address.slice(-4)}`
}

// Get token info from airdrop
export const getTokenInfo = (airdrop: AirdropSearchResultItem, tokens: Token[]): Token | undefined => {
    return tokens.find((token) => token.address === airdrop.mint)
}

// Calculate vesting progress
export const calculateVestingProgress = (airdrop: AirdropDetail): number => {
    const now = Date.now() / 1000
    const start = airdrop.startVestingTs
    const end = airdrop.endVestingTs

    if (now <= start) return 0
    if (now >= end) return 100

    return ((now - start) / (end - start)) * 100
}

// Calculate unlocked amount
export const calculateUnlockedAmount = (airdrop: AirdropDetail): string => {
    const now = Date.now() / 1000
    const start = airdrop.startVestingTs
    const end = airdrop.endVestingTs
    const total = BigInt(airdrop.userClaimableAmount)

    if (now <= start) return "0"
    if (now >= end) return airdrop.userClaimableAmount

    const progress = (now - start) / (end - start)
    return BigInt(Math.floor(Number(total) * progress)).toString()
}
