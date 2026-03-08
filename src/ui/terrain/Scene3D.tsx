import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { getDefaultSceneConfig, PUERTO_VARAS_CENTER } from '../../domain/geo/scene-config'
import { TerrainMesh } from './TerrainMesh'
import { Route3D } from '../routes/Route3D'
import { latLngToTile, tileToBBox } from '../../domain/elevation/elevation'
import type { GPXRoute } from '../../domain/gpx/gpx-parser'
import { useMemo } from 'react'

const MESH_SIZE = 100
const ZOOM = 12

interface Scene3DProps {
  routes?: GPXRoute[]
  exaggeration?: number
}

function SceneLighting() {
  const config = getDefaultSceneConfig()
  return (
    <>
      <ambientLight intensity={config.ambientLightIntensity} />
      <directionalLight
        position={[50, 80, 30]}
        intensity={config.directionalLightIntensity}
        castShadow
      />
    </>
  )
}

function TerrainGrid() {
  const config = getDefaultSceneConfig()
  return (
    <Grid
      args={[config.gridSize, config.gridSize]}
      cellSize={1}
      sectionSize={10}
      cellColor="#444"
      sectionColor="#888"
      fadeDistance={200}
      fadeStrength={1}
      infiniteGrid
    />
  )
}

export function Scene3D({ routes = [], exaggeration = 1.5 }: Scene3DProps) {
  const config = getDefaultSceneConfig()
  const { position } = config.camera

  const bbox = useMemo(() => {
    const tile = latLngToTile(PUERTO_VARAS_CENTER.lat, PUERTO_VARAS_CENTER.lng, ZOOM)
    return tileToBBox(tile.x, tile.y, tile.z)
  }, [])

  return (
    <Canvas
      camera={{
        fov: config.camera.fov,
        near: config.camera.near,
        far: config.camera.far,
        position: [position.x, position.y, position.z],
      }}
    >
      <SceneLighting />
      <TerrainGrid />
      <TerrainMesh exaggeration={exaggeration} meshSize={MESH_SIZE} zoom={ZOOM} />
      {routes.map((route, i) => (
        <Route3D
          key={i}
          route={route}
          bbox={bbox}
          meshSize={MESH_SIZE}
          exaggeration={exaggeration}
        />
      ))}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  )
}
