import type { Trek } from './trek'

export type SortField = 'difficulty' | 'length' | 'distance' | 'name'
export type SortDirection = 'asc' | 'desc'
export interface SortCriteria {
  field: SortField
  direction: SortDirection
}

function compareTreks(a: Trek, b: Trek, criteria: SortCriteria): number {
  const dir = criteria.direction === 'asc' ? 1 : -1
  switch (criteria.field) {
    case 'difficulty':
      return (a.difficulty.score - b.difficulty.score) * dir
    case 'length':
      return (a.stats.totalDistanceM - b.stats.totalDistanceM) * dir
    case 'distance':
      return (a.distanceFromHomeKm - b.distanceFromHomeKm) * dir
    case 'name':
      return a.name.localeCompare(b.name) * dir
  }
}

export function sortTreks(treks: Trek[], criteria: SortCriteria[]): Trek[] {
  const copy = [...treks]
  if (criteria.length === 0) return copy
  return copy.sort((a, b) => {
    for (const c of criteria) {
      const cmp = compareTreks(a, b, c)
      if (cmp !== 0) return cmp
    }
    return 0
  })
}

export function filterByRegion(treks: Trek[], region: string): Trek[] {
  return treks.filter((t) => t.region === region)
}

export function getRegions(treks: Trek[]): string[] {
  const unique = [...new Set(treks.map((t) => t.region))]
  return unique.sort((a, b) => a.localeCompare(b))
}
