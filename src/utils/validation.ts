import type { AirdropFormData, AirdropRecipient } from '@/types'
import { toast } from 'sonner'

//TODO: Use zod. https://zod.dev/

/**
 * Validate airdrop form data
 * @param formData Form data
 * @param recipients Recipients list
 * @returns Error message or null if valid
 */
export const validateAirdropForm = (formData: AirdropFormData, recipients: AirdropRecipient[]): string | null => {
  // Check required fields
  if (!formData.name.trim()) {
    toast.error('Please enter a name for the airdrop')
    return 'Missing airdrop name'
  }

  if (!formData.mint) {
    toast.error('Please select a token')
    return 'Missing token selection'
  }

  if (recipients.length === 0) {
    toast.error('Please upload recipients')
    return 'No recipients uploaded'
  }

  // Validate dates for vested airdrops
  if (formData.type === 'vested') {
    if (!formData.endDate) {
      toast.error('Please set an end date for vested airdrop')
      return 'Missing end date for vested airdrop'
    }

    if (!formData.startImmediately && formData.startDate) {
      const startTimestamp = new Date(`${formData.startDate}T${formData.startTime || '00:00'}`).getTime()
      const endTimestamp = new Date(`${formData.endDate}T${formData.endTime || '23:59'}`).getTime()
      const now = Date.now()

      if (endTimestamp < startTimestamp) {
        toast.error('End date must be after start date')
        return 'End date before start date'
      }

      if (endTimestamp < now) {
        toast.error('End date must be in the future')
        return 'End date in the past'
      }
    }
  }

  return null
}
