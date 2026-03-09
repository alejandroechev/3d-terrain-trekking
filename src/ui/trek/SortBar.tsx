import type { SortCriteria, SortField } from '../../domain/trek/trek-catalog'

interface SortBarProps {
  criteria: SortCriteria[]
  onSort: (field: SortField) => void
}

const SORT_OPTIONS: { field: SortField; label: string }[] = [
  { field: 'difficulty', label: 'Dificultad' },
  { field: 'distance', label: 'Distancia' },
  { field: 'length', label: 'Largo' },
  { field: 'name', label: 'Nombre' },
]

export function SortBar({ criteria, onSort }: SortBarProps) {
  const primary = criteria[0]

  return (
    <div className="flex gap-2 overflow-x-auto" role="toolbar" aria-label="Ordenar">
      {SORT_OPTIONS.map(({ field, label }) => {
        const isActive = primary?.field === field
        const arrow = isActive ? (primary.direction === 'asc' ? ' ↑' : ' ↓') : ''
        return (
          <button
            key={field}
            onClick={() => onSort(field)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-green-700 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {label}{arrow}
          </button>
        )
      })}
    </div>
  )
}
