//Types were mostly generated from api results

import type BN from 'bn.js'

//string. But for now only returns "SOLANA"
export type Chain = 'SOLANA'

export interface AirdropSearchResult {
  limit: number
  offset: number
  items: AirdropSearchResultItem[]
  total: number
}

export interface AirdropSearchResultItem {
  chain: Chain
  mint: string
  version: number
  address: string
  sender: string
  name: string
  maxNumNodes: string
  maxTotalClaim: string
  totalAmountUnlocked: string
  totalAmountLocked: string
  isActive: boolean
  isOnChain: boolean
  isVerified: boolean
  clawbackDt: string | null
  isAligned: boolean
}

export interface AirdropDetail extends AirdropSearchResultItem {
  type: 'Instant' | 'Vested'
  tokenSymbol: string
  tokenName: string
  tokenDecimals: number
  tokenLogo: string
  tokenPrice: number
  claimedCount: number
  totalRecipients: number
  claimedAmount: string
  userClaimableAmount: string
  userEligible: boolean
  startVestingTs: number
  endVestingTs: number
  unlockPeriod: number
  cliffAmount?: string
  cliffPercentage?: number
  unlockInterval: 'daily' | 'weekly' | 'monthly'
}

export interface AirdropCreateData {
  chain: Chain
  mint: string
  version: number
  address: string
  sender: string
  name: string
  maxNumNodes: string
  maxTotalClaim: string
  isActive: boolean
  isOnChain: boolean
  clawbackDt: string | null
  totalAmountUnlocked: string
  totalAmountLocked: string
  isAligned: boolean
  isVerified: boolean
  merkleRoot: number[]
  type?: 'Instant' | 'Vested'
  amountClaimed?: string
  tokenSymbol?: string
  tokenDecimals?: number
  usdValue?: number
  recipientsClaimed?: number
  totalRecipients?: number
}

export interface AirdropByIDRequest extends AirdropSearchResultItem {
  merkleRoot: number[]
}

export interface ClaimableAirdropResult {
  items: ClaimableAirdropItem[]
  limit: number
  offset: number
}

export interface ClaimableAirdropItem {
  chain: Chain
  distributorAddress: string
  address: string
  amountUnlocked: string
  amountLocked: string
  amountClaimed: string
  proof: number[][]
}

export interface AirdropFormData {
  name: string
  type: 'instant' | 'vested'
  mint: string
  startImmediately: boolean
  startDate: string
  startTime: string
  isCancellable: boolean
  singleClaim: boolean
  endDate: string
  endTime: string
  unlockInterval: 'daily' | 'weekly' | 'monthly'
}

export interface CreateAirdropParams {
  mint: string
  version: number
  root: number[]
  maxTotalClaim: string | number | BN
  maxNumNodes: string | number | BN
  unlockPeriod: number
  startVestingTs: number
  endVestingTs: number
  clawbackStartTs: number
  claimsClosableByAdmin: boolean
  claimsClosableByClaimant?: boolean
  claimsLimit?: number
  name: string
}

export interface AirdropRecipient {
  address: string
  amount: string
}

export type CsvRecipients = AirdropRecipient[]

export interface ClaimEligibilityData {
  userEligible: boolean
  userClaimed: boolean
}
