<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import BasePanel from '../components/BasePanel.vue'
import { useDiaryStore } from '../stores/diary.store'
import { formatDate } from '../utils/date'

const props = defineProps<{ id: string }>()
const diary = useDiaryStore()
const router = useRouter()
const trip = computed(() => diary.trips.find((item) => item.id === props.id))
const failedPhotos = ref<string[]>([])
const photos = computed(() => {
  if (!trip.value) return []
  if (trip.value.photos.length > 0) return trip.value.photos
  return [{ id: 'photo-1', caption: trip.value.city }]
})

watch(trip, (value) => {
  failedPhotos.value = []
  if (!value) router.replace({ name: 'not-found' })
}, { immediate: true })
</script>

<template>
  <RouterLink :to="{ name: 'feed' }" class="btn btn-ghost btn-sm mb-6 rounded-sm">← Назад до стрічки</RouterLink>
  <template v-if="trip">
    <div class="mb-8">
      <p class="mb-3 text-sm text-base-content/65">{{ trip.country }} · {{ trip.city }}</p>
      <h1 class="text-3xl font-semibold sm:text-4xl">{{ trip.title }}</h1>
      <p class="mt-4 text-sm text-base-content/65">{{ formatDate(trip.startDate) }} — {{ formatDate(trip.endDate) }}</p>
      <div class="mt-4 flex flex-wrap gap-2">
        <span v-for="tag in trip.tags" :key="tag" class="badge badge-outline rounded-sm">{{ tag }}</span>
      </div>
    </div>
    <div class="grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
      <BasePanel title="Про подорож">
        <p class="whitespace-pre-line leading-relaxed">{{ trip.description }}</p>
      </BasePanel>
      <BasePanel title="Відвідані місця">
        <ul v-if="trip.places.length" class="list-inside list-disc space-y-3 text-sm">
          <li v-for="place in trip.places" :key="place">{{ place }}</li>
        </ul>
        <p v-else class="text-sm text-base-content/65">Місця ще не додано.</p>
      </BasePanel>
    </div>
    <section class="mt-8" aria-labelledby="gallery-title">
      <h2 id="gallery-title" class="mb-2 text-xl font-semibold">Фотогалерея</h2>
      <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <figure v-for="photo in photos" :key="photo.id" class="overflow-hidden rounded-sm border border-base-300 bg-base-100">
          <img
            v-if="photo.url && !failedPhotos.includes(photo.id)"
            :src="photo.url"
            :alt="photo.caption"
            loading="lazy"
            referrerpolicy="no-referrer"
            class="aspect-[4/3] w-full object-cover"
            @error="failedPhotos.push(photo.id)"
          />
          <div v-else role="img" :aria-label="`Місце для фото: ${photo.caption}`" class="flex aspect-[4/3] items-center justify-center bg-base-300/60 text-sm text-base-content/60">Фото подорожі</div>
          <figcaption class="p-4 text-sm">{{ photo.caption }}</figcaption>
        </figure>
      </div>
    </section>
  </template>
</template>
