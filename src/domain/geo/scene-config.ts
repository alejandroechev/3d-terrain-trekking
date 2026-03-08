export interface LatLng {
  lat: number
  lng: number
}

export interface Vec3 {
  x: number
  y: number
  z: number
}

export interface CameraConfig {
  fov: number
  near: number
  far: number
  position: Vec3
}

export interface SceneConfig {
  camera: CameraConfig
  ambientLightIntensity: number
  directionalLightIntensity: number
  gridSize: number
}

export const PUERTO_VARAS_CENTER: LatLng = {
  lat: -41.32,
  lng: -72.98,
}

export function getDefaultCameraPosition(): Vec3 {
  return { x: 0, y: 50, z: 60 }
}

export function getDefaultSceneConfig(): SceneConfig {
  return {
    camera: {
      fov: 60,
      near: 0.1,
      far: 10000,
      position: getDefaultCameraPosition(),
    },
    ambientLightIntensity: 0.4,
    directionalLightIntensity: 0.8,
    gridSize: 100,
  }
}
