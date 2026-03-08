import { useMemo } from 'react'
import * as THREE from 'three'
import { buildTerrainGeometryData } from '../../domain/elevation/terrain-geometry'
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
    // Normalize elevation so that the range maps to ~30% of mesh width at exaggeration=1
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
    geo.computeVertexNormals()
    return geo
  }, [heightmap, exaggeration, meshSize])

  if (!geometry) return null

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color="#4a7c59"
        wireframe={false}
        flatShading
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
