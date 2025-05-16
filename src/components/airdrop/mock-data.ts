import { connection, cluster } from "@/lib/services";
import type { PriceResult, Recipient, Token, TokenMetadata } from "@/lib/types";
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from "@solana/web3.js";
import { ICluster } from "@streamflow/common";
import axios from "axios";

const proxyServerUrl = import.meta.env.VITE_PROXY_SERVER_URL;

export const parseCsv = async (file: File): Promise<Recipient[]> => {
    const text = await file.text()
    const lines = text.split("\n").slice(1) // Skip the header row

    const recipients: Recipient[] = lines.map((line, index) => {
        const [address, amount] = line.split(",")
        if (!address || !amount) {
            throw new Error(`Invalid file format at line ${index + 2}: Missing address or amount`)
        }

        return {
            address: address.trim(),
            amount: (parseFloat(amount.trim())).toString(), // Convert to lamports
        }
    })

    return recipients
}

// Mock function for fetching tokens in wallet
export const getTokensInWalletMock = async (): Promise<Token[]> => {

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

export async function getTokenMetadata(mint: string, cluster: ICluster): Promise<TokenMetadata> {
    const response = await axios.post(`${proxyServerUrl}/token-meta`, {
        addresses: [mint],
        cluster: cluster,
    }, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    });

    return response.data[mint] as TokenMetadata;
}

export async function fetchTokenBalances(walletAddress: string) {
    const publicKey = new PublicKey(walletAddress);

    // ✅ Get native SOL balance (in lamports)
    const lamports = await connection.getBalance(publicKey);
    const sol = lamports / 1e9;

    // ✅ Get all SPL token accounts
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
    });

    const tokens = await Promise.all(
        tokenAccounts.value.map(async ({ account }) => {
            const mint = account.data.parsed.info.mint as string;
            const amount = Number(account.data.parsed.info.tokenAmount.uiAmountString);

            // Fetch metadata for the token
            const meta = await getTokenMetadata(mint, cluster);

            return {
                mint,
                amount,
                ...meta
            };
        })
    );

    return {
        sol,
        tokens,
    };
};

export const fetchTokenPrice = async (tokenAddress: string, cluster: string = "devnet"): Promise<number> => {
    const endpoint = `${proxyServerUrl}/price?ids=${tokenAddress}&cluster=${cluster}`;
    const response = await fetch(endpoint);
    if (!response.ok) {
        throw new Error(`Failed to fetch price for token ${tokenAddress}`);
    }
    const data = await response.json() as PriceResult;
    return data?.data?.[tokenAddress]?.value ?? 0;
}
