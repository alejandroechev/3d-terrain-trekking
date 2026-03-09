import { useMemo } from 'react'
import * as THREE from 'three'
import { buildTerrainGeometryData } from '../../domain/elevation/terrain-geometry'
import { elevationToColor } from '../../domain/elevation/elevation-color'
import { computeSlopeMap } from '../../domain/elevation/slope-map'
import { PUERTO_VARAS_CENTER } from '../../domain/geo/scene-config'
import { latLngToTile } from '../../domain/elevation/elevation'
import { useTerrainData } from '../../hooks/useTerrainData'

interface TerrainMeshProps {
  exaggeration: number
  meshSize: number
  zoom?: number
  apiKey?: string
  showSlopeHeatmap?: boolean
}

export function TerrainMesh({ exaggeration, meshSize, zoom = 12, showSlopeHeatmap = false }: TerrainMeshProps) {
  const apiKey = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined
  const tile = useMemo(
    () => latLngToTile(PUERTO_VARAS_CENTER.lat, PUERTO_VARAS_CENTER.lng, zoom),
    [zoom]
  )

  const heightmap = useTerrainData(tile, apiKey)

  const geometry = useMemo(() => {
    if (!heightmap) return null

    const elevationRange = heightmap.maxElevation - heightmap.minElevation
    const scale = elevationRange > 0
      ? (meshSize * 0.3 * exaggeration) / elevationRange
      : exaggeration

    const data = buildTerrainGeometryData(heightmap, {
      width: meshSize,
      height: meshSize,
      exaggeration: scale,
    })

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(data.positions, 3))
    geo.setAttribute('uv', new THREE.BufferAttribute(data.uvs, 2))
    geo.setIndex(new THREE.BufferAttribute(data.indices, 1))

    // Vertex colors — elevation or slope heatmap mode
    const rows = heightmap.length
    const cols = heightmap[0].length
    const colors = new Float32Array(rows * cols * 3)

    if (showSlopeHeatmap) {
      const cellSize = meshSize / Math.max(rows, cols)
      const slopes = computeSlopeMap(heightmap, cellSize)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c
          const slope = slopes[r][c]
          // Green (flat) → Yellow (moderate) → Red (steep)
          const t = Math.min(slope / 45, 1)
          colors[idx * 3] = t
          colors[idx * 3 + 1] = 1 - t
          colors[idx * 3 + 2] = 0.1
        }
      }
    } else {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c
          const rgb = elevationToColor(
            heightmap[r][c],
            heightmap.minElevation,
            heightmap.maxElevation
          )
          colors[idx * 3] = rgb.r
          colors[idx * 3 + 1] = rgb.g
          colors[idx * 3 + 2] = rgb.b
        }
      }
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.computeVertexNormals()
    return geo
  }, [heightmap, exaggeration, meshSize, showSlopeHeatmap])

  if (!geometry) return null

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        vertexColors
        flatShading
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
