import { clusterApiUrl } from "@solana/web3.js"
import { ICluster } from "@streamflow/common"

export const env = {
  api: {
    privateStreamflow: "https://staging-api.streamflow.finance/v2/api",
    publicStreamflow: "https://staging-api-public.streamflow.finance/v2/api",
    proxyServer: import.meta.env.VITE_PROXY_SERVER_URL || "http://localhost:3000",
  },
  solana: {
    cluster: ICluster.Devnet,
    rpcEndpoint: clusterApiUrl(ICluster.Devnet),
  },
} as const


