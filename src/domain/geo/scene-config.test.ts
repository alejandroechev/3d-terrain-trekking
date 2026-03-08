import { describe, it, expect } from 'vitest'
import {
  PUERTO_VARAS_CENTER,
  getDefaultCameraPosition,
  getDefaultSceneConfig,
} from './scene-config'

describe('scene-config', () => {
  describe('PUERTO_VARAS_CENTER', () => {
    it('has the correct latitude and longitude for Puerto Varas', () => {
      expect(PUERTO_VARAS_CENTER.lat).toBeCloseTo(-41.32, 2)
      expect(PUERTO_VARAS_CENTER.lng).toBeCloseTo(-72.98, 2)
    })
  })

  describe('getDefaultCameraPosition', () => {
    it('returns a position above and behind the center looking down', () => {
      const position = getDefaultCameraPosition()
      // Camera should be elevated (Y > 0)
      expect(position.y).toBeGreaterThan(0)
      // Camera should have some distance on Z axis for perspective
      expect(position.z).toBeGreaterThan(0)
    })

    it('returns a position with three numeric components', () => {
      const position = getDefaultCameraPosition()
      expect(typeof position.x).toBe('number')
      expect(typeof position.y).toBe('number')
      expect(typeof position.z).toBe('number')
      expect(Number.isFinite(position.x)).toBe(true)
      expect(Number.isFinite(position.y)).toBe(true)
      expect(Number.isFinite(position.z)).toBe(true)
    })
  })

  describe('getDefaultSceneConfig', () => {
    it('returns scene configuration with camera, lights, and grid settings', () => {
      const config = getDefaultSceneConfig()
      expect(config.camera).toBeDefined()
      expect(config.camera.fov).toBeGreaterThan(0)
      expect(config.camera.near).toBeGreaterThan(0)
      expect(config.camera.far).toBeGreaterThan(config.camera.near)
      expect(config.ambientLightIntensity).toBeGreaterThan(0)
      expect(config.directionalLightIntensity).toBeGreaterThan(0)
      expect(config.gridSize).toBeGreaterThan(0)
    })
  })
})
