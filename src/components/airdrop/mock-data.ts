import type { AirdropDetail, AirdropSearchResult, Recipient, Token } from "@/lib/types"

// Mock data for airdrops
export const fetchAirdropsMock = async (): Promise<AirdropSearchResult> => {
    return {
        limit: 10,
        offset: 0,
        total: 5,
        items: [
            {
                chain: "SOLANA",
                mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                version: 1,
                address: "airdrop1111111111111111111111111111111",
                sender: "sender11111111111111111111111111111111",
                name: "USDC Community Airdrop",
                maxNumNodes: "1000",
                maxTotalClaim: "100000000000",
                totalAmountUnlocked: "50000000000",
                totalAmountLocked: "50000000000",
                isActive: true,
                isOnChain: true,
                isVerified: true,
                clawbackDt: null,
                isAligned: true,
            },
            {
                chain: "SOLANA",
                mint: "So11111111111111111111111111111111111111112",
                version: 1,
                address: "airdrop2222222222222222222222222222222",
                sender: "sender22222222222222222222222222222222",
                name: "SOL Rewards Program",
                maxNumNodes: "500",
                maxTotalClaim: "1000000000",
                totalAmountUnlocked: "500000000",
                totalAmountLocked: "500000000",
                isActive: true,
                isOnChain: true,
                isVerified: true,
                clawbackDt: null,
                isAligned: true,
            },
            {
                chain: "SOLANA",
                mint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
                version: 1,
                address: "airdrop3333333333333333333333333333333",
                sender: "sender33333333333333333333333333333333",
                name: "mSOL Staking Rewards",
                maxNumNodes: "250",
                maxTotalClaim: "500000000",
                totalAmountUnlocked: "250000000",
                totalAmountLocked: "250000000",
                isActive: true,
                isOnChain: true,
                isVerified: true,
                clawbackDt: null,
                isAligned: true,
            },
            {
                chain: "SOLANA",
                mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
                version: 1,
                address: "airdrop4444444444444444444444444444444",
                sender: "sender44444444444444444444444444444444",
                name: "BONK Token Distribution",
                maxNumNodes: "2000",
                maxTotalClaim: "10000000000000",
                totalAmountUnlocked: "5000000000000",
                totalAmountLocked: "5000000000000",
                isActive: true,
                isOnChain: true,
                isVerified: true,
                clawbackDt: null,
                isAligned: true,
            },
            {
                chain: "SOLANA",
                mint: "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj",
                version: 1,
                address: "airdrop5555555555555555555555555555555",
                sender: "sender55555555555555555555555555555555",
                name: "Starbucks Rewards",
                maxNumNodes: "100",
                maxTotalClaim: "1000000000",
                totalAmountUnlocked: "500000000",
                totalAmountLocked: "500000000",
                isActive: false,
                isOnChain: true,
                isVerified: true,
                clawbackDt: null,
                isAligned: true,
            },
        ],
    }
}

// Mock data for claimable airdrops
export const fetchClaimableAirdropsMock = async (): Promise<AirdropSearchResult> => {
    return {
        limit: 10,
        offset: 0,
        total: 2,
        items: [
            {
                chain: "SOLANA",
                mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                version: 1,
                address: "airdrop1111111111111111111111111111111",
                sender: "sender11111111111111111111111111111111",
                name: "USDC Community Airdrop",
                maxNumNodes: "1000",
                maxTotalClaim: "100000000000",
                totalAmountUnlocked: "50000000000",
                totalAmountLocked: "50000000000",
                isActive: true,
                isOnChain: true,
                isVerified: true,
                clawbackDt: null,
                isAligned: true,
            },
            {
                chain: "SOLANA",
                mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
                version: 1,
                address: "airdrop4444444444444444444444444444444",
                sender: "sender44444444444444444444444444444444",
                name: "BONK Token Distribution",
                maxNumNodes: "2000",
                maxTotalClaim: "10000000000000",
                totalAmountUnlocked: "5000000000000",
                totalAmountLocked: "5000000000000",
                isActive: true,
                isOnChain: true,
                isVerified: true,
                clawbackDt: null,
                isAligned: true,
            },
        ],
    }
}

// Mock data for airdrop details
export const fetchAirdropByIdMock = async (id: string): Promise<AirdropDetail | null> => {
    const airdrops: Record<string, AirdropDetail> = {
        airdrop1111111111111111111111111111111: {
            chain: "SOLANA",
            mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            version: 1,
            address: "airdrop1111111111111111111111111111111",
            sender: "sender11111111111111111111111111111111",
            name: "USDC Community Airdrop",
            maxNumNodes: "1000",
            maxTotalClaim: "100000000000",
            totalAmountUnlocked: "50000000000",
            totalAmountLocked: "50000000000",
            isActive: true,
            isOnChain: true,
            isVerified: true,
            clawbackDt: null,
            isAligned: true,
            type: "Instant",
            tokenSymbol: "USDC",
            tokenName: "USD Coin",
            tokenDecimals: 6,
            tokenLogo:
                "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
            tokenPrice: 1.0,
            claimedCount: 450,
            totalRecipients: 1000,
            claimedAmount: "50000000000",
            userClaimableAmount: "100000000",
            userEligible: true,
            startVestingTs: Date.now() / 1000 - 86400 * 7, // 7 days ago
            endVestingTs: Date.now() / 1000 + 86400 * 30, // 30 days from now
            unlockPeriod: 86400, // 1 day
            unlockInterval: "daily",
        },
        airdrop2222222222222222222222222222222: {
            chain: "SOLANA",
            mint: "So11111111111111111111111111111111111111112",
            version: 1,
            address: "airdrop2222222222222222222222222222222",
            sender: "sender22222222222222222222222222222222",
            name: "SOL Rewards Program",
            maxNumNodes: "500",
            maxTotalClaim: "1000000000",
            totalAmountUnlocked: "500000000",
            totalAmountLocked: "500000000",
            isActive: true,
            isOnChain: true,
            isVerified: true,
            clawbackDt: null,
            isAligned: true,
            type: "Vested",
            tokenSymbol: "SOL",
            tokenName: "Solana",
            tokenDecimals: 9,
            tokenLogo:
                "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
            tokenPrice: 150.0,
            claimedCount: 200,
            totalRecipients: 500,
            claimedAmount: "500000000",
            userClaimableAmount: "0",
            userEligible: false,
            startVestingTs: Date.now() / 1000 - 86400 * 30, // 30 days ago
            endVestingTs: Date.now() / 1000 + 86400 * 60, // 60 days from now
            unlockPeriod: 604800, // 1 week
            cliffAmount: "100000000",
            cliffPercentage: 10,
            unlockInterval: "weekly",
        },
        airdrop3333333333333333333333333333333: {
            chain: "SOLANA",
            mint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
            version: 1,
            address: "airdrop3333333333333333333333333333333",
            sender: "sender33333333333333333333333333333333",
            name: "mSOL Staking Rewards",
            maxNumNodes: "250",
            maxTotalClaim: "500000000",
            totalAmountUnlocked: "250000000",
            totalAmountLocked: "250000000",
            isActive: true,
            isOnChain: true,
            isVerified: true,
            clawbackDt: null,
            isAligned: true,
            type: "Vested",
            tokenSymbol: "mSOL",
            tokenName: "Marinade staked SOL",
            tokenDecimals: 9,
            tokenLogo:
                "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png",
            tokenPrice: 160.0,
            claimedCount: 100,
            totalRecipients: 250,
            claimedAmount: "250000000",
            userClaimableAmount: "0",
            userEligible: false,
            startVestingTs: Date.now() / 1000 - 86400 * 15, // 15 days ago
            endVestingTs: Date.now() / 1000 + 86400 * 45, // 45 days from now
            unlockPeriod: 2592000, // 1 month
            unlockInterval: "monthly",
        },
        airdrop4444444444444444444444444444444: {
            chain: "SOLANA",
            mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
            version: 1,
            address: "airdrop4444444444444444444444444444444",
            sender: "sender44444444444444444444444444444444",
            name: "BONK Token Distribution",
            maxNumNodes: "2000",
            maxTotalClaim: "10000000000000",
            totalAmountUnlocked: "5000000000000",
            totalAmountLocked: "5000000000000",
            isActive: true,
            isOnChain: true,
            isVerified: true,
            clawbackDt: null,
            isAligned: true,
            type: "Instant",
            tokenSymbol: "BONK",
            tokenName: "Bonk",
            tokenDecimals: 5,
            tokenLogo:
                "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png",
            tokenPrice: 0.00002,
            claimedCount: 1500,
            totalRecipients: 2000,
            claimedAmount: "5000000000000",
            userClaimableAmount: "5000000000",
            userEligible: true,
            startVestingTs: Date.now() / 1000 - 86400 * 10, // 10 days ago
            endVestingTs: Date.now() / 1000 + 86400 * 20, // 20 days from now
            unlockPeriod: 86400, // 1 day
            unlockInterval: "daily",
        },
        airdrop5555555555555555555555555555555: {
            chain: "SOLANA",
            mint: "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj",
            version: 1,
            address: "airdrop5555555555555555555555555555555",
            sender: "sender55555555555555555555555555555555",
            name: "Starbucks Rewards",
            maxNumNodes: "100",
            maxTotalClaim: "1000000000",
            totalAmountUnlocked: "500000000",
            totalAmountLocked: "500000000",
            isActive: false,
            isOnChain: true,
            isVerified: true,
            clawbackDt: null,
            isAligned: true,
            type: "Vested",
            tokenSymbol: "STSOL",
            tokenName: "Lido Staked SOL",
            tokenDecimals: 9,
            tokenLogo:
                "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj/logo.png",
            tokenPrice: 155.0,
            claimedCount: 50,
            totalRecipients: 100,
            claimedAmount: "500000000",
            userClaimableAmount: "0",
            userEligible: false,
            startVestingTs: Date.now() / 1000 - 86400 * 20, // 20 days ago
            endVestingTs: Date.now() / 1000 + 86400 * 40, // 40 days from now
            unlockPeriod: 604800, // 1 week
            cliffAmount: "50000000",
            cliffPercentage: 5,
            unlockInterval: "weekly",
        },
    }

    return airdrops[id] || null
}

// Mock function for claiming an airdrop
export const claimAirdropMock = async (id: string): Promise<{ success: boolean; txId: string }> => {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return {
        success: true,
        txId: "tx" + Math.random().toString(36).substring(2, 15),
    }
}

// Mock function for creating an airdrop
export const createAirdropMock = async (params: any): Promise<{ success: boolean; airdropId: string }> => {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
        success: true,
        airdropId: "airdrop" + Math.random().toString(36).substring(2, 15),
    }
}

// Mock function for parsing CSV
export const parseCSVMock = async (file: File): Promise<Recipient[]> => {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return mock recipients
    return [
        { address: "address1111111111111111111111111111111", amount: "1000000" },
        { address: "address2222222222222222222222222222222", amount: "2000000" },
        { address: "address3333333333333333333333333333333", amount: "3000000" },
        { address: "address4444444444444444444444444444444", amount: "4000000" },
        { address: "address5555555555555555555555555555555", amount: "5000000" },
    ]
}

// Mock function for fetching tokens in wallet
export const fetchTokensInWalletMock = async (): Promise<Token[]> => {
    return [
        {
            address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            symbol: "USDC",
            name: "USD Coin",
            decimals: 6,
            logoURI:
                "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
            balance: "1000000000",
            price: 1.0,
        },
        {
            address: "So11111111111111111111111111111111111111112",
            symbol: "SOL",
            name: "Solana",
            decimals: 9,
            logoURI:
                "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
            balance: "5000000000",
            price: 150.0,
        },
        {
            address: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
            symbol: "mSOL",
            name: "Marinade staked SOL",
            decimals: 9,
            logoURI:
                "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png",
            balance: "2000000000",
            price: 160.0,
        },
        {
            address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
            symbol: "BONK",
            name: "Bonk",
            decimals: 5,
            logoURI:
                "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png",
            balance: "100000000000",
            price: 0.00002,
        },
    ]
}

// Mock function for fetching token price
export const fetchTokenPriceMock = async (tokenAddress: string): Promise<number> => {
    const prices: Record<string, number> = {
        EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: 1.0, // USDC
        So11111111111111111111111111111111111111112: 150.0, // SOL
        mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So: 160.0, // mSOL
        DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263: 0.00002, // BONK
        "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj": 155.0, // stSOL
    }

    return prices[tokenAddress] || 0
}
