export interface FavoritesStore {
  toggle(trekId: string): void
  isFavorite(trekId: string): boolean
  getAll(): string[]
}

export class InMemoryFavoritesStore implements FavoritesStore {
  private ids = new Set<string>()

  toggle(trekId: string): void {
    if (this.ids.has(trekId)) {
      this.ids.delete(trekId)
    } else {
      this.ids.add(trekId)
    }
  }

  isFavorite(trekId: string): boolean {
    return this.ids.has(trekId)
  }

  getAll(): string[] {
    return [...this.ids]
  }
}

const STORAGE_KEY = 'senderos-favoritos'

export class LocalStorageFavoritesStore implements FavoritesStore {
  toggle(trekId: string): void {
    const ids = this.load()
    const index = ids.indexOf(trekId)
    if (index >= 0) {
      ids.splice(index, 1)
    } else {
      ids.push(trekId)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  }

  isFavorite(trekId: string): boolean {
    return this.load().includes(trekId)
  }

  getAll(): string[] {
    return this.load()
  }

  private load(): string[] {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as string[]
  }
}
