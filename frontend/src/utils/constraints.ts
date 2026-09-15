import type { Itinerary, ConstraintCheckItem } from '@/types/itinerary'
import { formatCurrency, percentage } from './budget'

const availableHoursFor = (days: number): number => days * 7 // ~7 productive touring hours/day

export const buildConstraintChecks = (itinerary: Itinerary): ConstraintCheckItem[] => {
  const { input, totals, scores } = itinerary
  const availableHours = availableHoursFor(input.durationDays)

  const budgetStatus: ConstraintCheckItem['status'] =
    totals.cost <= input.budgetMax ? 'ok' : totals.cost <= input.budgetMax * 1.15 ? 'warning' : 'exceeded'

  const timeStatus: ConstraintCheckItem['status'] =
    totals.timeHours <= availableHours ? 'ok' : totals.timeHours <= availableHours * 1.15 ? 'warning' : 'exceeded'

  const interestStatus: ConstraintCheckItem['status'] =
    scores.interestMatch >= 80 ? 'ok' : scores.interestMatch >= 60 ? 'warning' : 'exceeded'

  const routeStatus: ConstraintCheckItem['status'] =
    scores.routeEfficiency >= 75 ? 'ok' : scores.routeEfficiency >= 55 ? 'warning' : 'exceeded'

  return [
    {
      key: 'budget',
      label: 'Budget',
      status: budgetStatus,
      detail:
        budgetStatus === 'exceeded'
          ? `Budget exceeded by ${formatCurrency(totals.cost - input.budgetMax)}`
          : budgetStatus === 'warning'
            ? `Slightly over target by ${formatCurrency(totals.cost - input.budgetMax)}`
            : `${formatCurrency(input.budgetMax - totals.cost)} to spare`,
      actualLabel: formatCurrency(totals.cost),
      targetLabel: formatCurrency(input.budgetMax),
      percent: percentage(totals.cost, input.budgetMax),
    },
    {
      key: 'time',
      label: 'Available Time',
      status: timeStatus,
      detail:
        timeStatus === 'exceeded'
          ? `Itinerary runs ${(totals.timeHours - availableHours).toFixed(1)}h over your available time`
          : `Fits within your available ${availableHours}h window`,
      actualLabel: `${totals.timeHours.toFixed(1)}h`,
      targetLabel: `${availableHours}h`,
      percent: percentage(totals.timeHours, availableHours),
    },
    {
      key: 'interest',
      label: 'Interest Match',
      status: interestStatus,
      detail:
        interestStatus === 'ok'
          ? 'Highly personalized to what you love'
          : 'Consider adding more interests for a stronger match',
      actualLabel: `${scores.interestMatch}%`,
      targetLabel: '100%',
      percent: scores.interestMatch,
    },
    {
      key: 'route',
      label: 'Route Efficiency',
      status: routeStatus,
      detail:
        routeStatus === 'ok'
          ? 'Minimal backtracking between stops'
          : 'Some stops require extra travel time',
      actualLabel: `${scores.routeEfficiency}%`,
      targetLabel: '100%',
      percent: scores.routeEfficiency,
    },
  ]
}

export const hasFailingConstraint = (checks: ConstraintCheckItem[]): boolean =>
  checks.some((c) => c.status === 'exceeded')
