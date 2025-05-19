import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAllAirdrops } from '@/hooks/airdrop/useAllAirdrops'
import { useClaimableAirdrops } from '@/hooks/airdrop/useClaimableAirdrops'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { AirdropCard } from './AirdropCard'



export const AirdropList = () => {
  const { connected, publicKey } = useWallet()
  const walletAddress = publicKey?.toBase58()
  const { data: allAirdrops, isLoading: isLoadingAllAirdrops } = useAllAirdrops()
  const { data: claimableAirdrops, isLoading: isLoadingClaimableAirdrops } = useClaimableAirdrops(walletAddress)

  const [searchParams, setSearchParams] = useSearchParams()

  const tab = searchParams.get('tab') === 'claimable' ? 'claimable' : 'all'
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))

  // Memoize paginated data
  const paginatedAllAirdrops = useMemo(
    () => (allAirdrops ? paginate(allAirdrops, page, PAGE_SIZE) : []),
    [allAirdrops, page]
  )
  const paginatedClaimableAirdrops = useMemo(
    () => (claimableAirdrops ? paginate(claimableAirdrops, page, PAGE_SIZE) : []),
    [claimableAirdrops, page]
  )

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value, page: '1' })
  }

  const handlePageChange = (newPage: number) => {
    setSearchParams({ tab, page: String(newPage) })
  }

  return (
    <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="all">All Airdrops</TabsTrigger>
        <TabsTrigger value="claimable">Claimable</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-0">
        {isLoadingAllAirdrops ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(PAGE_SIZE)].map((_, i) => (
              <Skeleton key={i} className="h-[200px] w-full" />
            ))}
          </div>
        ) : !allAirdrops || allAirdrops.length === 0 ? (
          <div className="col-span-full text-center py-8">No airdrops found</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedAllAirdrops.map((airdrop) => (
                <AirdropCard key={airdrop.address} airdrop={airdrop} />
              ))}
            </div>
            <Pagination
              page={page}
              total={allAirdrops.length}
              pageSize={PAGE_SIZE}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </TabsContent>

      <TabsContent value="claimable" className="mt-0">
        {isLoadingClaimableAirdrops ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(PAGE_SIZE)].map((_, i) => (
              <Skeleton key={i} className="h-[200px] w-full" />
            ))}
          </div>
        ) : !connected ? (
          <div className="col-span-full text-center py-8 space-y-4">
            <p className="text-red-500">Connect your wallet to view claimable airdrops</p>
            <WalletMultiButton>
              Connect Wallet
            </WalletMultiButton>
          </div>
        ) : !claimableAirdrops || claimableAirdrops.length === 0 ? (
          <div className="col-span-full text-center py-8">No claimable airdrops found</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedClaimableAirdrops.map((airdrop) => (
                <AirdropCard key={airdrop.distributorAddress} airdrop={airdrop} />
              ))}
            </div>
            <Pagination
              page={page}
              total={claimableAirdrops.length}
              pageSize={PAGE_SIZE}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </TabsContent>
    </Tabs>
  )
}


const PAGE_SIZE = 9

function Pagination({
  page,
  total,
  pageSize,
  onPageChange,
}: {
  page: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
}) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null
  return (
    <div className="flex justify-center gap-2 mt-6">
      <button
        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Prev
      </button>
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button
        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  )
}

function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}