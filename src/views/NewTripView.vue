<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import BasePanel from '../components/BasePanel.vue'
import { useDiaryStore } from '../stores/diary.store'
import type { TripPhoto } from '../types'

const diary = useDiaryStore()
const router = useRouter()
const form = reactive({
  title: '',
  country: '',
  city: '',
  startDate: '',
  endDate: '',
  description: '',
  tags: '',
  places: '',
  photos: '',
})
const error = ref('')
const tripSaved = ref(false)
const hasChanges = computed(() => Object.values(form).some((value) => value !== ''))

onBeforeRouteLeave(() => {
  if (!tripSaved.value && hasChanges.value) {
    return window.confirm('Є незбережені зміни. Залишити сторінку?')
  }
  return true
})

function splitItems(value: string): string[] {
  return [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))]
}

function save() {
  error.value = ''
  if (!form.title.trim() || !form.country.trim() || !form.city.trim() || !form.description.trim()) {
    error.value = 'Заповніть назву, країну, місто та опис.'
    return
  }
  if (!form.startDate || !form.endDate || form.endDate < form.startDate) {
    error.value = 'Перевірте дати: завершення не може бути раніше початку.'
    return
  }
  const tags = splitItems(form.tags.toLocaleLowerCase('uk-UA'))
  if (!tags.length) {
    error.value = 'Додайте хоча б одну мітку.'
    return
  }

  const photoUrls = form.photos.split('\n').map((url) => url.trim()).filter(Boolean)
  const photos: TripPhoto[] = []

  for (const [index, value] of photoUrls.entries()) {
    try {
      const url = new URL(value)
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        error.value = 'Посилання на фото має починатися з http:// або https://.'
        return
      }
      photos.push({ id: `photo-${index + 1}`, caption: `Фото ${index + 1}`, url: url.href })
    } catch {
      error.value = 'Перевірте посилання на фотографії.'
      return
    }
  }

  const id = diary.addTrip({
    title: form.title.trim(),
    country: form.country.trim(),
    city: form.city.trim(),
    startDate: form.startDate,
    endDate: form.endDate,
    description: form.description.trim(),
    tags,
    places: splitItems(form.places),
    photos,
  })
  tripSaved.value = true
  router.push({ name: 'trip', params: { id } })
}
</script>

<template>
  <BasePanel title="Новий запис">
    <form class="grid max-w-3xl gap-5" @submit.prevent="save">
      <label class="grid gap-2 text-sm font-medium">Назва подорожі
        <input v-model="form.title" required maxlength="100" class="input w-full rounded-sm" />
      </label>
      <div class="grid gap-5 sm:grid-cols-2">
        <label class="grid gap-2 text-sm font-medium">Країна
          <input v-model="form.country" required maxlength="80" class="input w-full rounded-sm" />
        </label>
        <label class="grid gap-2 text-sm font-medium">Місто або населений пункт
          <input v-model="form.city" required maxlength="80" class="input w-full rounded-sm" />
        </label>
        <label class="grid gap-2 text-sm font-medium">Початок подорожі
          <input v-model="form.startDate" type="date" required class="input w-full rounded-sm" />
        </label>
        <label class="grid gap-2 text-sm font-medium">Завершення подорожі
          <input v-model="form.endDate" type="date" :min="form.startDate || undefined" required class="input w-full rounded-sm" />
        </label>
      </div>
      <label class="grid gap-2 text-sm font-medium">Опис та враження
        <textarea v-model="form.description" rows="6" required maxlength="12000" class="textarea w-full rounded-sm" />
      </label>
      <label class="grid gap-2 text-sm font-medium">Мітки через кому
        <input v-model="form.tags" required maxlength="200" placeholder="гори, природа" class="input w-full rounded-sm" />
      </label>
      <label class="grid gap-2 text-sm font-medium">Відвідані місця через кому (необов’язково)
        <input v-model="form.places" maxlength="600" class="input w-full rounded-sm" />
      </label>
      <label class="grid gap-2 text-sm font-medium">Посилання на фото (по одному в рядку, необов’язково)
        <textarea v-model="form.photos" rows="3" maxlength="12000" class="textarea w-full rounded-sm" />
      </label>
      <p class="text-sm text-base-content/65">Без фотографій у галереї буде показано заглушку.</p>
      <p v-if="error" role="alert" class="text-sm text-error">{{ error }}</p>
      <button type="submit" class="btn btn-neutral w-fit rounded-sm">Зберегти подорож</button>
    </form>
  </BasePanel>
</template>
