import { clusterApiUrl } from '@solana/web3.js';
import { ICluster } from '@streamflow/common';
import { StreamflowDistributorSolana } from '@streamflow/distributor';
import { IGetClaimData } from '@streamflow/distributor/solana';
import axios from 'axios';
import { PRIVATE_STREAMFLOW_STAGING_API, PUBLIC_STREAMFLOW_STAGING_API } from './constants';
import { AirdropByIDRequest, AirdropCreateData, AirdropSearchResult, AirdropSearchResultItem, ClaimableAirdropItem, ClaimableAirdropResult, csvReciepeints } from './types';

const axiosStreamflow = axios.create({
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

const proxyServerUrl = import.meta.env.VITE_PROXY_SERVER_URL;
const merkleCreateUrl = `${proxyServerUrl}/merkle`;

export const getAirdropById = async (distributorId: string): Promise<AirdropCreateData> => {
    try {

        const response = await axiosStreamflow.get<AirdropByIDRequest[]>(`${PUBLIC_STREAMFLOW_STAGING_API}/airdrops`, {
            params: {
                chain: 'SOLANA',
                addresses: distributorId,
            }
        });


        const responseData = response.data[0];

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
        throw new Error('Failed to fetch airdrop data')
    }
};


export const getAllAirdrops = async (): Promise<AirdropSearchResultItem[]> => {
    try {

        const response = await axiosStreamflow.post(`${PRIVATE_STREAMFLOW_STAGING_API}/airdrops/search`, {
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
        });

        const data = response.data as AirdropSearchResult

        return data.items

    } catch (error) {
        console.error('Error fetching all airdrops:', error);
        throw new Error('Failed to fetch airdrops data');
    }
};


export async function getClaimableAirdrops(address: string):
    Promise<ClaimableAirdropResult['items']> {
    try {
        console.log("Fetching airdrops from address", address);
        const response = await axiosStreamflow.get<ClaimableAirdropResult>(
            `${PRIVATE_STREAMFLOW_STAGING_API}/airdrops/claimable/${address}/`, {
            params: {
                limit: 100,
                skimZeroValued: true
            }
        }
        );

        return response.data.items;
    } catch (error) {
        console.error('Error fetching claimable airdrops:', error);
        throw new Error('Failed to fetch claimable airdrops');
    }
};

export const getClaimantByAddress = async (
    distributorId: string,
    claimantAddress: string
): Promise<ClaimableAirdropItem | null> => {
    try {
        const response = await axios.get<ClaimableAirdropItem | null>(
            `${proxyServerUrl}/claimant/${distributorId}/${claimantAddress}`
        );

        return response.data;
    } catch (error: unknown) {
        console.error("Error fetching claimant from server:", error);
        throw new Error("Failed to fetch claimant data");
    }
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



export async function createAirdropMerkleRoot({
    recepients,
    name,
    mint,
}: {
    recepients: csvReciepeints;
    name: string;
    mint: string;
}): Promise<{
    merkleRoot: number[];
    chain: string;
    mint: string;
    version: number;
    address: string;
    sender: string;
    name: string;
    maxNumNodes: string;
    maxTotalClaim: string;
    totalAmountUnlocked: string;
    totalAmountLocked: string;
    isActive: boolean;
    isOnChain: boolean;
    isVerified: boolean;
}> {
    try {
        const response = await axios.post(merkleCreateUrl, {
            recepients,
            name,
            mint,
        }, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error creating airdrop merkle root:', error);
        throw new Error('Failed to create airdrop merkle root');
    }
}
