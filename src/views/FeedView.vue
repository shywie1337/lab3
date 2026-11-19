<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import TripCard from '../components/TripCard.vue'
import { useDiaryStore } from '../stores/diary.store'

const diary = useDiaryStore()
const selectedTag = ref('')
const sortOrder = ref('newest')

const visibleTrips = computed(() => {
  const filtered = diary.trips.filter((trip) => !selectedTag.value || trip.tags.includes(selectedTag.value))
  return [...filtered].sort((a, b) => {
    return sortOrder.value === 'newest'
      ? b.startDate.localeCompare(a.startDate)
      : a.startDate.localeCompare(b.startDate)
  })
})
</script>

<template>
  <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-3xl font-semibold">Записи з подорожей</h1>
      <p class="mt-2 text-base-content/65">Маршрути, відвідані місця та враження.</p>
    </div>
    <RouterLink :to="{ name: 'new-trip' }" class="btn btn-neutral rounded-sm">Додати подорож</RouterLink>
  </div>

  <div class="mb-6 flex flex-wrap items-end gap-4 border-y border-base-300 py-4">
    <label class="grid gap-2 text-sm font-medium">
      Мітка
      <select v-model="selectedTag" class="select w-48 rounded-sm bg-base-100">
        <option value="">Усі мітки</option>
        <option v-for="tag in diary.tags" :key="tag" :value="tag">{{ tag }}</option>
      </select>
    </label>
    <label class="grid gap-2 text-sm font-medium">
      За датою початку
      <select v-model="sortOrder" class="select w-48 rounded-sm bg-base-100">
        <option value="newest">Спочатку нові</option>
        <option value="oldest">Спочатку давні</option>
      </select>
    </label>
    <p class="pb-2 text-sm text-base-content/65 sm:ml-auto" aria-live="polite">Записів: {{ visibleTrips.length }}</p>
  </div>

  <div v-if="visibleTrips.length" class="grid gap-5 md:grid-cols-2">
    <TripCard v-for="trip in visibleTrips" :key="trip.id" :trip="trip" />
  </div>
  <p v-else class="rounded-sm border border-base-300 bg-base-100 p-8 text-center">За цією міткою записів немає.</p>
</template>
