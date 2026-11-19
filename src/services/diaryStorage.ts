import type { TravelerProfile, Trip } from '../types'

const STORAGE_KEY = 'travel-diary-data'

interface SavedDiary {
  trips: Trip[]
  profile: TravelerProfile
}

function isTrip(value: unknown): value is Trip {
  if (!value || typeof value !== 'object') return false
  const trip = value as Partial<Trip>
  const textFields = [trip.id, trip.title, trip.country, trip.city, trip.description]

  if (!textFields.every((field) => typeof field === 'string')) return false
  if (typeof trip.startDate !== 'string' || typeof trip.endDate !== 'string') return false
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trip.startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(trip.endDate)) return false
  if (Number.isNaN(Date.parse(trip.startDate)) || Number.isNaN(Date.parse(trip.endDate))) return false

  if (!Array.isArray(trip.tags) || !trip.tags.every((tag) => typeof tag === 'string')) return false
  if (!Array.isArray(trip.places) || !trip.places.every((place) => typeof place === 'string')) return false
  if (!Array.isArray(trip.photos)) return false

  return trip.photos.every((photo) => {
    if (!photo || typeof photo.id !== 'string' || typeof photo.caption !== 'string') return false
    if (photo.url === undefined) return true
    if (typeof photo.url !== 'string') return false
    try {
      const url = new URL(photo.url)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  })
}

export function loadDiary(): SavedDiary | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data: unknown = JSON.parse(raw)
    if (!data || typeof data !== 'object') return null
    const diary = data as Partial<SavedDiary>
    const profile = diary.profile

    if (!Array.isArray(diary.trips) || !diary.trips.every(isTrip)) return null
    if (new Set(diary.trips.map((trip) => trip.id)).size !== diary.trips.length) return null
    if (!profile || typeof profile.name !== 'string'
      || typeof profile.avatarUrl !== 'string' || typeof profile.bio !== 'string') return null

    return { trips: diary.trips, profile }
  } catch {
    return null
  }
}

export function saveDiary(data: SavedDiary): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}
