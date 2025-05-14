import { ICluster } from '@streamflow/common';
import { StreamflowDistributorSolana } from '@streamflow/distributor';
import { IGetClaimData } from '@streamflow/distributor/solana';
import { PRIVATE_STREAMFLOW_STAGING_API, PUBLIC_STREAMFLOW_STAGING_API } from './constants';
import { AirdropCreateData, AirdropSearchResult, AirdropSearchResultItem, ClaimantData } from './types';
import { clusterApiUrl } from '@solana/web3.js';

export const getAirdropById = async (distributorId: string): Promise<AirdropCreateData> => {
    try {
        const response = await fetch(`${PUBLIC_STREAMFLOW_STAGING_API}/airdrops?chain=SOLANA&addresses=${distributorId}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch airdrop data');
        }

        const responseData = (await response.json())[0];

        const data: Partial<AirdropCreateData> = {};
        data.type = responseData.totalAmountLocked !== "0" ? 'Vested' : 'Instant';

        const maxTotal = BigInt(responseData.maxTotalClaim);
        const locked = BigInt(responseData.totalAmountLocked);
        const unlocked = BigInt(responseData.totalAmountUnlocked);
        data.amountClaimed = (maxTotal - locked - unlocked).toString();

        return {
            ...responseData,
            ...data,
        };
    } catch (error) {
        console.error('Error fetching airdrop:', error);
        throw new Error('Failed to fetch airdrop data');
    }
};

export const getAllAirdrops = async (): Promise<AirdropSearchResultItem[]> => {
    try {
        const response = await fetch(`${PRIVATE_STREAMFLOW_STAGING_API}/airdrops/search`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                actor: "",
                limit: 10,
                offset: 0,
                filters: {
                    include: {
                        isOnChain: true,
                        isActive: true
                    }
                },
                sorters: [
                    {
                        by: "id",
                        order: "desc"
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch airdrops data');
        }

        const data = await response.json() as AirdropSearchResult;
        return data.items;
    } catch (error) {
        console.error('Error fetching all airdrops:', error);
        throw new Error('Failed to fetch airdrops data');
    }
};

export async function getClaimableAirdrops(address: string):
    Promise<AirdropSearchResultItem[]> {
    try {
        const response = await fetch(`${PRIVATE_STREAMFLOW_STAGING_API}/airdrops/claimable/${address}/?limit=100&skimZeroValued=true`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch claimable airdrops');
        }

        const data = await response.json() as AirdropSearchResult;
        return data.items;
    } catch (error) {
        console.error('Error fetching claimable airdrops:', error);
        throw new Error('Failed to fetch claimable airdrops');
    }
};


export const getClaimantByAddress = async (
    distributorId: string,
    claimantAddress: string
): Promise<ClaimantData | null> => {
    try {
        const response = await fetch(`${PRIVATE_STREAMFLOW_STAGING_API}/airdrops/${distributorId}/claimants/${claimantAddress}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        if (response.status === 404) {
            return null; // Claimant not found
        }

        if (!response.ok) {
            throw new Error('Failed to fetch claimant data');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching claimant:', error);
        throw new Error('Failed to fetch claimant data');
    }
};

// Mock function for token information - in a real app, this would fetch from a price API
export const getTokenInfo = async (mintAddress: string): Promise<{
    symbol: string;
    decimals: number;
    usdPrice: number;
}> => {
    const tokens: Record<string, { symbol: string; decimals: number; usdPrice: number }> = {
        'STREAMribRwybYpMmSYoCsQUdr6MZNXEqHgm7p1gu9M': {
            symbol: 'STREAM',
            decimals: 9,
            usdPrice: 0.135, // Example price
        },
    };

    return tokens[mintAddress] || {
        symbol: mintAddress.substring(0, 4),
        decimals: 9,
        usdPrice: 0.1, // Default price
    };
};

// For some reason, this always errors
export async function getClaimStatus(distributorId: string, claimantAddress: string) {
    const cluster = ICluster.Devnet
    const distributorClient = new StreamflowDistributorSolana.SolanaDistributorClient({
        clusterUrl:
            clusterApiUrl(cluster),
        cluster,
    });

    const data: IGetClaimData = {
        id: distributorId,
        recipient: claimantAddress,
    };
    const claimStatus = distributorClient.getClaims([data]);
    return claimStatus;
}
