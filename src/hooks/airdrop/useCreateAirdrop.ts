import { createAirdropMerkleRoot } from "@/services/api/airdropService"
import { createDistributor } from "@/services/blockchain/streamflowService"
import type { AirdropFormData, AirdropRecipient } from "@/types/airdrop"
import type { Wallet } from "@solana/wallet-adapter-react"
import type { ICreateDistributorData } from "@streamflow/distributor/solana"
import { useMutation } from "@tanstack/react-query"
import { BN } from "bn.js"
import type { PublicKey } from "@solana/web3.js"

interface CreateAirdropOptions {
  onSuccess?: (data: Awaited<ReturnType<typeof createDistributor>> & { address: string }) => void
  onError?: (error: unknown) => void
}

export const useCreateAirdrop = (
  wallet: Wallet | null,
  publicKey: PublicKey | null,
  options: CreateAirdropOptions = {},
) => {
  return useMutation({
    mutationFn: async ({ formData, recipients }: { formData: AirdropFormData; recipients: AirdropRecipient[] }) => {
      if (!wallet || !publicKey) {
        throw new Error("Wallet not connected")
      }

      // Calculate timestamps
      let startTimestamp = formData.startImmediately
        ? 0
        : Math.floor(new Date(`${formData.startDate}T${formData.startTime || "00:00"}`).getTime() / 1000)

      const now = Math.floor(Date.now() / 1000)
      if (startTimestamp < now) {
        startTimestamp = 0
      }

      const endTimestamp =
        formData.type === "vested"
          ? Math.floor(new Date(`${formData.endDate}T${formData.endTime || "23:59"}`).getTime() / 1000)
          : 0

      // Create merkle root
      const airdropWithMerkleRoot = await createAirdropMerkleRoot({
        recepients: recipients,
        name: formData.name,
        mint: formData.mint === "native" ? "So11111111111111111111111111111111111111112" : formData.mint,
      })

      // Calculate unlock period
      const unlockPeriod =
        formData.unlockInterval === "daily" ? 86400 : formData.unlockInterval === "weekly" ? 604800 : 2592000

      // @ts-expect-error: clawbackStartTs has default value in contract so does not need to be passed here
      const data: ICreateDistributorData = {
        root: airdropWithMerkleRoot.merkleRoot,
        mint: airdropWithMerkleRoot.mint,
        version: airdropWithMerkleRoot.version,
        maxTotalClaim: new BN(airdropWithMerkleRoot.maxTotalClaim),
        maxNumNodes: new BN(airdropWithMerkleRoot.maxNumNodes),
        unlockPeriod,
        startVestingTs: startTimestamp,
        ...(endTimestamp ? { endVestingTs: endTimestamp } : {}),
        claimsClosableByAdmin: formData.isCancellable,
        claimsClosableByClaimant: false,
        claimsLimit: formData.singleClaim ? 1 : 0,
      }

      const result = await createDistributor(data, wallet)

      return {
        ...result,
        address: airdropWithMerkleRoot.address,
      }
    },
    onSuccess: (data) => {
      if (options.onSuccess) {
        options.onSuccess(data)
      }
    },
    onError: (error) => {
      if (options.onError) {
        options.onError(error)
      }
    },
  })
}
