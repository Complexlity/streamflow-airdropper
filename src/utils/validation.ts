import type { AirdropFormData, AirdropRecipient } from '@/types'

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
    return 'Missing airdrop name'
  }

  if (!formData.mint) {
    return 'Missing token selection'
  }

  if (recipients.length === 0) {
    return 'No recipients uploaded'
  }

  // Validate dates for vested airdrops
  if (formData.type === 'vested') {
    if (!formData.endDate) {
      return 'Missing end date for vested airdrop'
    }

    if (!formData.startImmediately && formData.startDate) {
      const startTimestamp = new Date(`${formData.startDate}T${formData.startTime || '00:00'}`).getTime()
      const endTimestamp = new Date(`${formData.endDate}T${formData.endTime || '23:59'}`).getTime()
      const now = Date.now()

      if (endTimestamp < startTimestamp) {
        return 'End date must be after start date'
      }

      if (endTimestamp < now) {
        return 'End date must be in the future'
      }
    }
  }

  return null
}
