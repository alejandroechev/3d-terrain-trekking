import { useState } from 'react'
import type { Trek } from '../../domain/trek/trek'
import type { TrekEvent } from '../../domain/events/event-log'
import { getGoogleMapsUrl } from '../../domain/trek/trek'
import { ElevationProfileChart } from '../analysis/ElevationProfileChart'

interface TrekDetailProps {
  trek: Trek
  isFavorite: boolean
  events: TrekEvent[]
  onToggleFavorite: (id: string) => void
  onAddEvent: (trekId: string, date: string, description: string) => void
  onDeleteEvent: (eventId: string) => void
  onBack: () => void
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  if (h === 0) return `${m}min`
  if (m === 0) return `${h}h`
  return `${h}h ${m}min`
}

export function TrekDetail({
  trek,
  isFavorite,
  events,
  onToggleFavorite,
  onAddEvent,
  onDeleteEvent,
  onBack,
}: TrekDetailProps) {
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (date && description) {
      onAddEvent(trek.id, date, description)
      setDate('')
      setDescription('')
    }
  }

  return (
    <div className="p-4 space-y-4">
      <button onClick={onBack} className="text-green-700 font-medium">
        ← Volver
      </button>

      <div className="flex items-start justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{trek.name}</h2>
        <button
          onClick={() => onToggleFavorite(trek.id)}
          aria-label={isFavorite ? 'Quitar favorito' : 'Agregar favorito'}
          className="text-2xl"
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">{trek.region}</span>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded"
          style={{ backgroundColor: trek.difficulty.color, color: '#fff' }}
        >
          {trek.difficulty.score} {trek.difficulty.label}
        </span>
      </div>

      <p className="text-gray-700">{trek.description}</p>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-gray-100 rounded p-2">
          <span className="text-gray-500">Distancia</span>
          <p className="font-bold">{(trek.stats.totalDistanceM / 1000).toFixed(1)} km</p>
        </div>
        <div className="bg-gray-100 rounded p-2">
          <span className="text-gray-500">Ascenso</span>
          <p className="font-bold">{Math.round(trek.stats.totalAscentM)} m</p>
        </div>
        <div className="bg-gray-100 rounded p-2">
          <span className="text-gray-500">Descenso</span>
          <p className="font-bold">{Math.round(trek.stats.totalDescentM)} m</p>
        </div>
        <div className="bg-gray-100 rounded p-2">
          <span className="text-gray-500">Pendiente máx.</span>
          <p className="font-bold">{Math.round(trek.stats.maxGradePercent)}%</p>
        </div>
        <div className="bg-gray-100 rounded p-2">
          <span className="text-gray-500">Elevación máx.</span>
          <p className="font-bold">{Math.round(trek.stats.maxElevationM)} m</p>
        </div>
        <div className="bg-gray-100 rounded p-2">
          <span className="text-gray-500">Tiempo estimado</span>
          <p className="font-bold">{formatTime(trek.stats.estimatedTimeMinutes)}</p>
        </div>
      </div>

      <a
        href={getGoogleMapsUrl(trek.startLat, trek.startLng)}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center bg-green-700 text-white rounded-lg py-2 font-medium"
      >
        📍 Abrir en Google Maps
      </a>

      {trek.gpxRoute.points.length >= 2 && (
        <ElevationProfileChart route={trek.gpxRoute} />
      )}

      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Registro de salidas</h3>
        {events.length > 0 ? (
          <ul className="space-y-2">
            {events.map((event) => (
              <li
                key={event.id}
                className="flex items-center justify-between bg-gray-100 rounded p-2 text-sm"
              >
                <div>
                  <span className="font-medium">{event.date}</span>
                  <span className="text-gray-600 ml-2">{event.description}</span>
                </div>
                <button
                  onClick={() => onDeleteEvent(event.id)}
                  aria-label="Eliminar salida"
                  className="text-red-500 text-sm ml-2"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Sin salidas registradas</p>
        )}

        <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm flex-shrink-0"
            aria-label="Fecha"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción"
            className="border rounded px-2 py-1 text-sm flex-1 min-w-0"
            aria-label="Descripción"
          />
          <button
            type="submit"
            className="bg-green-700 text-white rounded px-3 py-1 text-sm font-medium"
          >
            Agregar
          </button>
        </form>
      </section>
    </div>
  )
}
