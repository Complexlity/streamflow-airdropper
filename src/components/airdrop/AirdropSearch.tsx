"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/**
 * Search component for finding airdrops by ID
 */
export const AirdropSearch = () => {
  const [airdropId, setAirdropId] = useState("")
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (airdropId.trim()) {
      navigate(`/airdrop/${airdropId.trim()}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-lg gap-2">
      <Input
        placeholder="Enter Airdrop ID"
        value={airdropId}
        onChange={(e) => setAirdropId(e.target.value)}
        className="flex-grow"
      />
      <Button type="submit">
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </form>
  )
}
