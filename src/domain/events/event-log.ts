export interface TrekEvent {
  id: string
  trekId: string
  date: string
  description: string
}

export interface EventLog {
  addEvent(trekId: string, date: string, description: string): TrekEvent
  getEvents(trekId: string): TrekEvent[]
  getAllEvents(): TrekEvent[]
  deleteEvent(eventId: string): void
}

export class InMemoryEventLog implements EventLog {
  private events: TrekEvent[] = []
  private nextId = 1

  addEvent(trekId: string, date: string, description: string): TrekEvent {
    const event: TrekEvent = {
      id: String(this.nextId++),
      trekId,
      date,
      description,
    }
    this.events.push(event)
    return event
  }

  getEvents(trekId: string): TrekEvent[] {
    return this.events.filter((e) => e.trekId === trekId)
  }

  getAllEvents(): TrekEvent[] {
    return [...this.events]
  }

  deleteEvent(eventId: string): void {
    this.events = this.events.filter((e) => e.id !== eventId)
  }
}

const STORAGE_KEY = 'senderos-registro'

export class LocalStorageEventLog implements EventLog {
  private readEvents(): TrekEvent[] {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  }

  private writeEvents(events: TrekEvent[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  }

  private generateId(events: TrekEvent[]): string {
    const maxId = events.reduce((max, e) => {
      const n = parseInt(e.id, 10)
      return Number.isNaN(n) ? max : Math.max(max, n)
    }, 0)
    return String(maxId + 1)
  }

  addEvent(trekId: string, date: string, description: string): TrekEvent {
    const events = this.readEvents()
    const event: TrekEvent = {
      id: this.generateId(events),
      trekId,
      date,
      description,
    }
    events.push(event)
    this.writeEvents(events)
    return event
  }

  getEvents(trekId: string): TrekEvent[] {
    return this.readEvents().filter((e) => e.trekId === trekId)
  }

  getAllEvents(): TrekEvent[] {
    return this.readEvents()
  }

  deleteEvent(eventId: string): void {
    const events = this.readEvents().filter((e) => e.id !== eventId)
    this.writeEvents(events)
  }
}
