import { describe, it, expect, beforeEach } from 'vitest'
import {
  InMemoryEventLog,
  LocalStorageEventLog,
  type EventLog,
} from './event-log'

function runEventLogTests(name: string, createLog: () => EventLog) {
  describe(name, () => {
    let log: EventLog

    beforeEach(() => {
      log = createLog()
    })

    it('addEvent creates a new event with correct fields', () => {
      const event = log.addEvent('trek-1', '2025-03-15', 'Subida al volcán Osorno')

      expect(event.trekId).toBe('trek-1')
      expect(event.date).toBe('2025-03-15')
      expect(event.description).toBe('Subida al volcán Osorno')
      expect(event.id).toBeDefined()
      expect(typeof event.id).toBe('string')
    })

    it('addEvent returns the created event with a unique id', () => {
      const a = log.addEvent('trek-1', '2025-03-15', 'Primera salida')
      const b = log.addEvent('trek-1', '2025-03-16', 'Segunda salida')

      expect(a.id).not.toBe(b.id)
    })

    it('getEvents returns only events for the specified trek', () => {
      log.addEvent('trek-1', '2025-01-01', 'Evento A')
      log.addEvent('trek-2', '2025-01-02', 'Evento B')
      log.addEvent('trek-1', '2025-01-03', 'Evento C')

      const events = log.getEvents('trek-1')

      expect(events).toHaveLength(2)
      expect(events.every((e) => e.trekId === 'trek-1')).toBe(true)
    })

    it('getEvents returns empty array when no events exist', () => {
      const events = log.getEvents('inexistente')

      expect(events).toEqual([])
    })

    it('getAllEvents returns all events across all treks', () => {
      log.addEvent('trek-1', '2025-01-01', 'Uno')
      log.addEvent('trek-2', '2025-01-02', 'Dos')
      log.addEvent('trek-3', '2025-01-03', 'Tres')

      const all = log.getAllEvents()

      expect(all).toHaveLength(3)
      const trekIds = all.map((e) => e.trekId)
      expect(trekIds).toContain('trek-1')
      expect(trekIds).toContain('trek-2')
      expect(trekIds).toContain('trek-3')
    })

    it('deleteEvent removes the specified event', () => {
      const event = log.addEvent('trek-1', '2025-01-01', 'Para borrar')

      log.deleteEvent(event.id)

      expect(log.getAllEvents()).toHaveLength(0)
      expect(log.getEvents('trek-1')).toHaveLength(0)
    })

    it('deleteEvent with non-existent ID does not throw', () => {
      log.addEvent('trek-1', '2025-01-01', 'Seguro')

      expect(() => log.deleteEvent('no-existe')).not.toThrow()
      expect(log.getAllEvents()).toHaveLength(1)
    })
  })
}

// Run shared suite for InMemoryEventLog
runEventLogTests('InMemoryEventLog', () => new InMemoryEventLog())

// Run shared suite for LocalStorageEventLog
runEventLogTests('LocalStorageEventLog', () => {
  localStorage.clear()
  return new LocalStorageEventLog()
})

// Additional tests specific to localStorage persistence
describe('LocalStorageEventLog persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('persists events across instances', () => {
    const first = new LocalStorageEventLog()
    first.addEvent('trek-1', '2025-06-01', 'Día soleado')
    first.addEvent('trek-2', '2025-06-02', 'Con lluvia')

    const second = new LocalStorageEventLog()

    expect(second.getAllEvents()).toHaveLength(2)
    expect(second.getEvents('trek-1')).toHaveLength(1)
    expect(second.getEvents('trek-1')[0].description).toBe('Día soleado')
  })

  it('persists deletions across instances', () => {
    const first = new LocalStorageEventLog()
    const event = first.addEvent('trek-1', '2025-06-01', 'Temporal')
    first.deleteEvent(event.id)

    const second = new LocalStorageEventLog()

    expect(second.getAllEvents()).toHaveLength(0)
  })

  it('generates unique IDs across instances', () => {
    const first = new LocalStorageEventLog()
    const a = first.addEvent('trek-1', '2025-01-01', 'Primero')

    const second = new LocalStorageEventLog()
    const b = second.addEvent('trek-1', '2025-01-02', 'Segundo')

    expect(a.id).not.toBe(b.id)
  })
})
