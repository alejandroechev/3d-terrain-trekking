import { useMemo } from 'react'
import * as THREE from 'three'
import { buildTerrainGeometryData } from '../../domain/elevation/terrain-geometry'
import { elevationToColor } from '../../domain/elevation/elevation-color'
import { PUERTO_VARAS_CENTER } from '../../domain/geo/scene-config'
import { latLngToTile } from '../../domain/elevation/elevation'
import { useTerrainData } from '../../hooks/useTerrainData'

interface TerrainMeshProps {
  exaggeration: number
  meshSize: number
  zoom?: number
  apiKey?: string
}

export function TerrainMesh({ exaggeration, meshSize, zoom = 12 }: TerrainMeshProps) {
  const tile = useMemo(
    () => latLngToTile(PUERTO_VARAS_CENTER.lat, PUERTO_VARAS_CENTER.lng, zoom),
    [zoom]
  )

  const heightmap = useTerrainData(tile)

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

    // Vertex colors based on elevation
    const rows = heightmap.length
    const cols = heightmap[0].length
    const colors = new Float32Array(rows * cols * 3)
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
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.computeVertexNormals()
    return geo
  }, [heightmap, exaggeration, meshSize])

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
