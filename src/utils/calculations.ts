import type { AirdropDetail } from '@/types'

/**
 * Calculate progress percentage
 * @param claimed Amount claimed
 * @param total Total amount
 * @returns Progress percentage (0-100)
 */
export const calculateProgress = (claimed: string, total: string): number => {
  if (total === '0') return 0
  return (Number(claimed) / Number(total)) * 100
}

/**
 * Calculate vesting progress
 * @param airdrop Airdrop details
 * @returns Vesting progress percentage (0-100)
 */
export const calculateVestingProgress = (airdrop: AirdropDetail): number => {
  const now = Date.now() / 1000
  const start = airdrop.startVestingTs
  const end = airdrop.endVestingTs

  if (now <= start) return 0
  if (now >= end) return 100

  return ((now - start) / (end - start)) * 100
}

/**
 * Calculate unlocked amount based on vesting schedule
 * @param airdrop Airdrop details
 * @returns Unlocked amount as string
 */
export const calculateUnlockedAmount = (airdrop: AirdropDetail): string => {
  const now = Date.now() / 1000
  const start = airdrop.startVestingTs
  const end = airdrop.endVestingTs
  const total = BigInt(airdrop.userClaimableAmount)

  if (now <= start) return '0'
  if (now >= end) return airdrop.userClaimableAmount

  const progress = (now - start) / (end - start)
  return BigInt(Math.floor(Number(total) * progress)).toString()
}
