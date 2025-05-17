/**
 * Calculate progress percentage
 * @param claimed Amount claimed
 * @param total Total amount
 * @returns Progress percentage (0-100)
 */
export const calculateProgress = (claimed: string, total: string): number => {
  if (total === '0') return 0
  return (Number(claimed) / Number(total)) * 100
}
