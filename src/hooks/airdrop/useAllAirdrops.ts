"use client"

import { QUERY_KEYS } from "@/config/constants"
import {
    getAllAirdrops
} from "@/services/api/airdropService"
import { useQuery } from "@tanstack/react-query"

export const useAllAirdrops = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.getAirdrops],
        queryFn: () => getAllAirdrops(),
    })
}
