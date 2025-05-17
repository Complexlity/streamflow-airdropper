import { ApiError } from '@/types'
import { toast } from 'sonner'

/**
 * Handle API errors with consistent messaging
 * @param error Error object
 * @param fallbackMessage Fallback message if error is not ApiError
 */
export const handleApiError = (error: unknown, fallbackMessage = 'An unexpected error occurred'): void => {
  console.error('API Error:', error)

  if (error instanceof ApiError) {
    toast.error(error.message)
    console.error('API Error:', error)
    return
  }

  if (error instanceof Error) {
    toast.error(error.message)
    return
  }

  // Error hass a message property
  if (error && typeof error === 'object' && 'message' in error && error.message && typeof error.message === 'string') {
    toast.error(error.message)
    return
  }

  toast.error(fallbackMessage)
}
