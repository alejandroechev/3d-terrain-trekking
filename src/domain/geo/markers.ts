export interface PlaceMarker {
  id: string
  name: string
  lat: number
  lng: number
  notes?: string
  visitedDate?: string
}

let counter = 0

export function createMarker(name: string, lat: number, lng: number): PlaceMarker {
  return {
    id: `marker-${Date.now()}-${++counter}`,
    name,
    lat,
    lng,
  }
}

export function serializeMarkers(markers: PlaceMarker[]): string {
  return JSON.stringify(markers)
}

export function deserializeMarkers(json: string): PlaceMarker[] {
  try {
    const parsed = JSON.parse(json)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
