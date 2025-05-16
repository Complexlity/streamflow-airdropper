import { clusterApiUrl, Connection } from "@solana/web3.js";
import { StreamflowDistributorSolana } from "@streamflow/distributor";
import { ICluster } from "@streamflow/common";

export const cluster = ICluster.Devnet
export const distributorClient = new StreamflowDistributorSolana.SolanaDistributorClient({
    clusterUrl: clusterApiUrl(cluster),
    cluster,
})

export const connection = new Connection(clusterApiUrl(cluster), 'confirmed');