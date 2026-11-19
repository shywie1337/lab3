import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { initialTrips } from '../data/trips'
import { loadDiary } from '../services/diaryStorage'
import type { NewTrip, TravelerProfile, Trip } from '../types'

export const useDiaryStore = defineStore('diary', () => {
  const saved = loadDiary()
  const trips = ref<Trip[]>(saved?.trips ?? [...initialTrips])
  const profile = ref<TravelerProfile>(saved?.profile ?? { name: '', avatarUrl: '', bio: '' })
  const tags = computed(() => [...new Set(trips.value.flatMap((trip) => trip.tags))].sort())

  function addTrip(data: NewTrip): string {
    const id = crypto.randomUUID()
    const photos = data.photos.length > 0
      ? data.photos
      : [{ id: 'photo-1', caption: data.city }]

    trips.value.push({ ...data, id, photos })
    return id
  }

  function updateProfile(data: TravelerProfile) {
    profile.value = { ...data }
  }

  return { trips, profile, tags, addTrip, updateProfile }
})
