import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { getDefaultSceneConfig } from '../../domain/geo/scene-config'
import { TerrainMesh } from './TerrainMesh'

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

export function Scene3D() {
  const config = getDefaultSceneConfig()
  const { position } = config.camera

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
      <TerrainMesh exaggeration={1} meshSize={100} />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  )
}
