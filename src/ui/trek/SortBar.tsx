import type { SortCriteria, SortField } from '../../domain/trek/trek-catalog'

interface SortBarProps {
  criteria: SortCriteria[]
  onSort: (field: SortField) => void
  onClear?: () => void
}

const SORT_OPTIONS: { field: SortField; label: string }[] = [
  { field: 'difficulty', label: 'Dificultad' },
  { field: 'distance', label: 'Distancia' },
  { field: 'length', label: 'Largo' },
  { field: 'name', label: 'Nombre' },
]

export function SortBar({ criteria, onSort, onClear }: SortBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto items-center" role="toolbar" aria-label="Ordenar">
      {SORT_OPTIONS.map(({ field, label }) => {
        const index = criteria.findIndex((c) => c.field === field)
        const isActive = index !== -1
        const criterion = isActive ? criteria[index] : null
        const arrow = criterion ? (criterion.direction === 'asc' ? '↑' : '↓') : ''
        const rank = isActive && criteria.length > 1 ? index + 1 : null
        return (
          <button
            key={field}
            onClick={() => onSort(field)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors relative ${
              index === 0
                ? 'bg-green-700 text-white'
                : isActive
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700'
            }`}
          >
            {rank !== null && (
              <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-white text-green-700 rounded-full mr-1">
                {rank}
              </span>
            )}
            {label} {arrow}
          </button>
        )
      })}
      {criteria.length > 1 && onClear && (
        <button
          onClick={onClear}
          className="px-2 py-1.5 text-sm text-gray-500 hover:text-gray-700"
          aria-label="Limpiar orden"
        >
          ✕
        </button>
      )}
    </div>
  )
}
