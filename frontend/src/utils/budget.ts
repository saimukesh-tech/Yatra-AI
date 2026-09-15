export const formatCurrency = (amount: number): string =>
  `₹${Math.round(amount).toLocaleString('en-IN')}`

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

export const percentage = (value: number, total: number): number => {
  if (total <= 0) return 0
  return clamp(Math.round((value / total) * 100), 0, 100)
}

export type BudgetTier = 'Budget' | 'Moderate' | 'Comfort' | 'Premium'

export const budgetTierLabel = (max: number): BudgetTier => {
  if (max <= 2000) return 'Budget'
  if (max <= 6000) return 'Moderate'
  if (max <= 15000) return 'Comfort'
  return 'Premium'
}

export const durationLabel = (days: number, nights: number): string =>
  `${days} Day${days !== 1 ? 's' : ''} (${nights} Night${nights !== 1 ? 's' : ''})`
