import { useState, useEffect, useMemo } from 'react'
import type { Trek } from './domain/trek/trek'
import type { SortCriteria, SortField } from './domain/trek/trek-catalog'
import { sortTreks, filterByRegion, getRegions } from './domain/trek/trek-catalog'
import { LocalStorageFavoritesStore } from './domain/favorites/favorites-store'
import { LocalStorageEventLog } from './domain/events/event-log'
import { loadAllTreks } from './domain/trek/load-treks'
import { TrekCard } from './ui/trek/TrekCard'
import { TrekDetail } from './ui/trek/TrekDetail'
import { SortBar } from './ui/trek/SortBar'
import { RegionFilter } from './ui/trek/RegionFilter'

function App() {
  const [treks, setTreks] = useState<Trek[]>([])
  const [selectedTrek, setSelectedTrek] = useState<Trek | null>(null)
  const [sortCriteria, setSortCriteria] = useState<SortCriteria[]>([
    { field: 'name', direction: 'asc' },
  ])
  const [regionFilter, setRegionFilter] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const favoritesStore = useMemo(() => new LocalStorageFavoritesStore(), [])
  const eventLog = useMemo(() => new LocalStorageEventLog(), [])
  const [favoritesVersion, setFavoritesVersion] = useState(0)
  const [eventsVersion, setEventsVersion] = useState(0)

  useEffect(() => {
    loadAllTreks().then((loaded) => {
      setTreks(loaded)
      setLoading(false)
    })
  }, [])

  const displayedTreks = useMemo(() => {
    void favoritesVersion
    const result = regionFilter ? filterByRegion(treks, regionFilter) : treks
    return sortTreks(result, sortCriteria)
  }, [treks, sortCriteria, regionFilter, favoritesVersion])

  const regions = useMemo(() => getRegions(treks), [treks])

  const selectedEvents = useMemo(
    () => (selectedTrek ? eventLog.getEvents(selectedTrek.id) : []),
    [selectedTrek, eventLog, eventsVersion],
  )

  const handleSort = (field: SortField) => {
    setSortCriteria((prev) => {
      if (prev[0]?.field === field) {
        return [
          { field, direction: prev[0].direction === 'asc' ? 'desc' : 'asc' },
          ...prev.slice(1),
        ]
      }
      const rest = prev.filter((c) => c.field !== field)
      return [{ field, direction: 'asc' }, ...rest]
    })
  }

  const handleToggleFavorite = (id: string) => {
    favoritesStore.toggle(id)
    setFavoritesVersion((v) => v + 1)
  }

  const handleAddEvent = (trekId: string, date: string, description: string) => {
    eventLog.addEvent(trekId, date, description)
    setEventsVersion((v) => v + 1)
  }

  const handleDeleteEvent = (eventId: string) => {
    eventLog.deleteEvent(eventId)
    setEventsVersion((v) => v + 1)
  }

  if (selectedTrek) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TrekDetail
          trek={selectedTrek}
          isFavorite={favoritesStore.isFavorite(selectedTrek.id)}
          events={selectedEvents}
          onToggleFavorite={handleToggleFavorite}
          onAddEvent={handleAddEvent}
          onDeleteEvent={handleDeleteEvent}
          onBack={() => setSelectedTrek(null)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-700 text-white p-4">
        <h1 className="text-xl font-bold">🏔️ Senderos del Sur</h1>
        <p className="text-sm text-green-200">Región de los Lagos</p>
      </header>
      <div className="p-4 space-y-3">
        <SortBar criteria={sortCriteria} onSort={handleSort} />
        <RegionFilter regions={regions} selected={regionFilter} onSelect={setRegionFilter} />
        {loading ? (
          <p className="text-gray-500 text-center mt-8">Cargando senderos…</p>
        ) : displayedTreks.length === 0 ? (
          <p className="text-gray-500 text-center mt-8">No se encontraron senderos</p>
        ) : (
          <div className="space-y-3">
            {displayedTreks.map((trek) => (
              <TrekCard
                key={trek.id}
                trek={trek}
                isFavorite={favoritesStore.isFavorite(trek.id)}
                onToggleFavorite={handleToggleFavorite}
                onSelect={setSelectedTrek}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
