<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Trip } from '../types'
import { formatDate } from '../utils/date'

const props = defineProps<{ trip: Trip }>()
const excerpt = computed(() => {
  const text = props.trip.description
  return text.length > 150 ? `${text.slice(0, 150).trim()}…` : text
})
</script>

<template>
  <RouterLink :to="{ name: 'trip', params: { id: trip.id } }" :aria-labelledby="`trip-title-${trip.id}`" class="card h-full rounded-sm border border-base-300 bg-base-100 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-primary">
    <article class="card-body gap-4 p-5 sm:p-6">
      <p class="text-sm text-base-content/65">{{ trip.country }} · {{ trip.city }}</p>
      <h2 :id="`trip-title-${trip.id}`" class="card-title text-xl">{{ trip.title }}</h2>
      <p class="flex-none text-xs text-base-content/65">{{ formatDate(trip.startDate) }} — {{ formatDate(trip.endDate) }}</p>
      <p class="text-sm leading-relaxed">{{ excerpt }}</p>
      <div class="mt-auto flex flex-wrap gap-2 pt-2">
        <span v-for="tag in trip.tags" :key="tag" class="badge badge-outline rounded-sm text-xs">{{ tag }}</span>
      </div>
      <span class="text-sm font-medium text-primary">Читати запис →</span>
    </article>
  </RouterLink>
</template>
