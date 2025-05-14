"use client"

import { AirdropList } from "@/components/airdrop/list"
import { AirdropSearch } from "@/components/airdrop/search"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useNavigate } from "react-router"

export function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Streamflow Airdrops</h1>
        <Button onClick={() => navigate("/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Airdrop
        </Button>
      </div>

      <div className="flex justify-center">
        <AirdropSearch />
      </div>

      <div>
        <AirdropList />
      </div>
    </div>
  )
}
