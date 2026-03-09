import { describe, it, expect } from 'vitest'
import { MapboxRequestCounter } from './mapbox-request-counter'

describe('MapboxRequestCounter', () => {
  it('starts at 0', () => {
    const counter = new MapboxRequestCounter()
    expect(counter.getCount()).toBe(0)
  })

  it('increments on each call', () => {
    const counter = new MapboxRequestCounter()
    counter.increment()
    counter.increment()
    expect(counter.getCount()).toBe(2)
  })

  it('increments by a specific amount', () => {
    const counter = new MapboxRequestCounter()
    counter.increment(5)
    expect(counter.getCount()).toBe(5)
  })

  it('calculates percentage of free tier (200k)', () => {
    const counter = new MapboxRequestCounter()
    counter.increment(1000)
    expect(counter.getPercentUsed()).toBeCloseTo(0.5, 1)
  })

  it('resets the counter', () => {
    const counter = new MapboxRequestCounter()
    counter.increment(100)
    counter.reset()
    expect(counter.getCount()).toBe(0)
  })

  it('formats count for display', () => {
    const counter = new MapboxRequestCounter()
    counter.increment(1234)
    expect(counter.getDisplayCount()).toBe('1,234')
  })
})
