import type { BBox } from '../elevation/elevation'
import type { GPXRoute, GPXPoint } from './gpx-parser'

const OVERPASS_API = 'https://overpass-api.de/api/interpreter'

/**
 * Build an Overpass QL query for hiking trails within a bounding box.
 */
export function buildOverpassQuery(bbox: BBox): string {
  const { south, west, north, east } = bbox
  const bb = `${south},${west},${north},${east}`
  return `[out:xml][timeout:30];
(
  way["highway"="path"](${bb});
  way["highway"="footway"](${bb});
  way["highway"="track"](${bb});
  relation["route"="hiking"](${bb});
);
out body;
>;
out skel qt;`
}

/**
 * Search for hiking trails in the given bounding box via Overpass API.
 * Returns GPXRoute-compatible objects.
 */
export async function searchTrails(bbox: BBox): Promise<GPXRoute[]> {
  const query = buildOverpassQuery(bbox)
  try {
    const response = await fetch(OVERPASS_API, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    if (!response.ok) return []

    const xml = await response.text()
    return parseOverpassResponse(xml)
  } catch {
    return []
  }
}

function parseOverpassResponse(xml: string): GPXRoute[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'text/xml')

  // Build node lookup: id → {lat, lng}
  const nodes = new Map<string, { lat: number; lng: number }>()
  for (const node of doc.querySelectorAll('node')) {
    const id = node.getAttribute('id')
    const lat = parseFloat(node.getAttribute('lat') ?? '0')
    const lng = parseFloat(node.getAttribute('lon') ?? '0')
    if (id) nodes.set(id, { lat, lng })
  }

  // Parse ways into routes
  const routes: GPXRoute[] = []
  for (const way of doc.querySelectorAll('way')) {
    const wayId = way.getAttribute('id') ?? 'unknown'
    const nameTag = way.querySelector('tag[k="name"]')
    const name = nameTag?.getAttribute('v') ?? `Sendero #${wayId}`

    const ndRefs = way.querySelectorAll('nd')
    const points: GPXPoint[] = []
    for (const nd of ndRefs) {
      const ref = nd.getAttribute('ref')
      if (ref && nodes.has(ref)) {
        const { lat, lng } = nodes.get(ref)!
        points.push({ lat, lng, elevation: 0 })
      }
    }

    if (points.length >= 2) {
      routes.push({ name, points })
    }
  }

  return routes
}
