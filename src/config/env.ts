import { clusterApiUrl } from '@solana/web3.js'
import { ICluster } from '@streamflow/common'

export const env = {
  api: {
    proxyServerUrl: import.meta.env.VITE_PROXY_SERVER_URL,
  },
  solana: {
    cluster: ICluster.Devnet,
    rpcEndpoint: import.meta.env.VITE_RPC_ENDPOINT || clusterApiUrl(ICluster.Devnet),
    nativeTokenLogo:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
  },
} as const

if (!env.api.proxyServerUrl) {
  throw new Error("Proxy server url missing from env (see .env.sample")
}