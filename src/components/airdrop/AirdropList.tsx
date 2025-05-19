import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAllAirdrops } from '@/hooks/airdrop/useAllAirdrops'
import { useClaimableAirdrops } from '@/hooks/airdrop/useClaimableAirdrops'
import { useWallet } from '@solana/wallet-adapter-react'
import { AirdropCard } from './AirdropCard'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export const AirdropList = () => {
  const { connected, publicKey } = useWallet()
  const walletAddress = publicKey?.toBase58()

  const { data: allAirdrops, isLoading: isLoadingAllAirdrops } = useAllAirdrops()
  const { data: claimableAirdrops, isLoading: isLoadingClaimableAirdrops } = useClaimableAirdrops(walletAddress)

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="all">All Airdrops</TabsTrigger>
        <TabsTrigger value="claimable">Claimable</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-0">
        {isLoadingAllAirdrops ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[200px] w-full" />
            ))}
          </div>
        ) : !allAirdrops || allAirdrops.length === 0 ? (
          <div className="col-span-full text-center py-8">No airdrops found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allAirdrops.map((airdrop) => (
              <AirdropCard key={airdrop.address} airdrop={airdrop} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="claimable" className="mt-0">
        {isLoadingClaimableAirdrops ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[200px] w-full" />
            ))}
          </div>
        ) : !connected ? (
          <div className="col-span-full text-center py-8 space-y-4">
            <p className="text-red-500">Connect your wallet to view claimable airdrops</p>
            <WalletMultiButton >
              Connect Wallet
            </WalletMultiButton>
          </div>
        ) : !claimableAirdrops || claimableAirdrops.length === 0 ? (
          <div className="col-span-full text-center py-8">No claimable airdrops found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {claimableAirdrops.map((airdrop) => (
              <AirdropCard key={airdrop.distributorAddress} airdrop={airdrop} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
