import { clusterApiUrl } from "@solana/web3.js";
import { StreamflowDistributorSolana } from "@streamflow/distributor";
import { ICluster } from "@streamflow/common";

const cluster = ICluster.Devnet
export const distributorClient = new StreamflowDistributorSolana.SolanaDistributorClient({
    clusterUrl: clusterApiUrl(cluster),
    cluster,
})