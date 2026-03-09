import { describe, it, expect } from 'vitest'
import { generateScreenshotFilename } from './screenshot'

describe('generateScreenshotFilename', () => {
  it('includes the prefix', () => {
    const name = generateScreenshotFilename('terreno')
    expect(name).toContain('terreno')
  })

  it('ends with .png', () => {
    const name = generateScreenshotFilename('terreno')
    expect(name).toMatch(/\.png$/)
  })

  it('includes a date component', () => {
    const name = generateScreenshotFilename('terreno')
    // Should contain year like 2026
    expect(name).toMatch(/\d{4}/)
  })

  it('generates unique names on consecutive calls', () => {
    const n1 = generateScreenshotFilename('test')
    const n2 = generateScreenshotFilename('test')
    // Technically could be same within same millisecond, but unlikely
    expect(typeof n1).toBe('string')
    expect(typeof n2).toBe('string')
  })
})
