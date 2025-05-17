import type { AirdropRecipient } from '@/types'

/**
 * Parse CSV file with recipients
 * @param file CSV file
 * @returns Array of recipients
 */
export const parseCsv = async (file: File): Promise<AirdropRecipient[]> => {
  const text = await file.text()
  const lines = text.split('\n')

  // Check if first line is a header
  const hasHeader = lines[0].toLowerCase().includes('address') || lines[0].toLowerCase().includes('amount')
  const startIndex = hasHeader ? 1 : 0

  const recipients: AirdropRecipient[] = []

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const [address, amount] = line.split(',').map((item) => item.trim())

    if (!address || !amount) {
      throw new Error(`Invalid format at line ${i + 1}: Missing address or amount`)
    }

    // Validate address format (basic check)
    if (address.length < 32) {
      throw new Error(`Invalid address format at line ${i + 1}`)
    }

    // Validate amount is a number
    const parsedAmount = Number.parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      throw new Error(`Invalid amount at line ${i + 1}: Must be a positive number`)
    }

    recipients.push({
      address,
      amount: parsedAmount.toString(),
    })
  }

  return recipients
}
