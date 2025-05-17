import type { AirdropRecipient } from '@/types'

/**
 * Parse CSV file with recipients
 * @param file CSV file
 * @returns Array of recipients
 */
export const parseCsv = async (file: File): Promise<AirdropRecipient[]> => {
  const text = await file.text()
  const lines = text.split('\n')

  const hasHeader = lines[0].toLowerCase().includes('address') || lines[0].toLowerCase().includes('amount')
  const startIndex = hasHeader ? 1 : 0

  const recipients: AirdropRecipient[] = []

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const [address, amount] = line.split(',').map((item) => item.trim())

    if (!address || !amount) {
      continue
    }

    if (address.length < 32) {
      continue
    }

    const parsedAmount = Number.parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      continue
    }

    recipients.push({
      address,
      amount: parsedAmount.toString(),
    })
  }

  if (recipients.length === 0) {
    throw new Error('No recipients found')
  }
  return recipients
}
