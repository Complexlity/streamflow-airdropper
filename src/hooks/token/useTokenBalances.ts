import { useQuery } from "@tanstack/react-query"
import { useWallet } from "@solana/wallet-adapter-react"
import { getTokenBalances } from "@/services/blockchain/solanaService"
import { QUERY_KEYS } from "@/config/constants"
export const useTokenBalances = () => {
  const { publicKey } = useWallet()
  const walletAddress = publicKey?.toBase58()

  return useQuery({
    queryKey: [QUERY_KEYS.getTokenBalances, walletAddress],
    queryFn: () => (walletAddress ? getTokenBalances(walletAddress) : null),
    enabled: !!walletAddress,
  })
}
