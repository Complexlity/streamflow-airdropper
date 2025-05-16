import { toast } from "sonner"
import { ApiError } from "@/types"

/**
 * Handle API errors with consistent messaging
 * @param error Error object
 * @param fallbackMessage Fallback message if error is not ApiError
 */
export const handleApiError = (error: unknown, fallbackMessage = "An unexpected error occurred"): void => {
  console.error("API Error:", error)

  if (error instanceof ApiError) {
    toast.error(error.message)
    return
  }

  if (error instanceof Error) {
    toast.error(error.message)
    return
  }

  toast.error(fallbackMessage)
}