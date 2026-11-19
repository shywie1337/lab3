<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import BasePanel from '../components/BasePanel.vue'
import { useAuthStore } from '../stores/auth.store'
import { useDiaryStore } from '../stores/diary.store'

const diary = useDiaryStore()
const auth = useAuthStore()
const form = reactive({ ...diary.profile, name: diary.profile.name || auth.nickname })
const message = ref('')
const error = ref('')
const avatarFailed = ref(false)
const savedProfile = ref({ ...form })
const hasChanges = computed(() => {
  return form.name !== savedProfile.value.name
    || form.avatarUrl !== savedProfile.value.avatarUrl
    || form.bio !== savedProfile.value.bio
})

onBeforeRouteLeave(() => {
  if (hasChanges.value) {
    return window.confirm('Є незбережені зміни. Залишити сторінку?')
  }
  return true
})

const initials = computed(() => form.name.trim().slice(0, 1).toLocaleUpperCase('uk-UA') || '?')
const avatarUrl = computed(() => {
  try {
    const url = new URL(form.avatarUrl)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : ''
  } catch {
    return ''
  }
})

watch(() => form.avatarUrl, () => {
  avatarFailed.value = false
})

watch(form, () => {
  message.value = ''
  error.value = ''
})

function save() {
  if (!form.name.trim()) {
    error.value = 'Введіть ім’я.'
    return
  }
  if (form.avatarUrl.trim() && !avatarUrl.value) {
    error.value = 'Для аватара вкажіть коректне http або https посилання.'
    return
  }
  diary.updateProfile({
    name: form.name.trim(),
    avatarUrl: form.avatarUrl.trim(),
    bio: form.bio.trim(),
  })
  savedProfile.value = { ...form }
  message.value = 'Профіль збережено.'
}
</script>

<template>
  <BasePanel title="Профіль мандрівника">
    <div class="grid items-start gap-8 md:grid-cols-[96px_1fr]">
      <div class="avatar" aria-label="Аватар мандрівника">
        <div class="flex size-24 items-center justify-center overflow-hidden rounded-sm bg-base-200 text-3xl">
          <img v-if="avatarUrl && !avatarFailed" :src="avatarUrl" alt="Аватар" referrerpolicy="no-referrer" @error="avatarFailed = true" />
          <span v-else class="flex h-full items-center justify-center">{{ initials }}</span>
        </div>
      </div>
      <form class="grid max-w-xl gap-5" @submit.prevent="save">
        <label class="grid gap-2 text-sm font-medium">Ім’я
          <input v-model="form.name" autocomplete="name" required maxlength="80" class="input w-full rounded-sm" />
        </label>
        <label class="grid gap-2 text-sm font-medium">Посилання на аватар (необов’язково)
          <input v-model="form.avatarUrl" type="url" maxlength="2000" placeholder="https://…" class="input w-full rounded-sm" />
        </label>
        <label class="grid gap-2 text-sm font-medium">Біографія
          <textarea v-model="form.bio" rows="5" maxlength="2000" class="textarea w-full rounded-sm" />
        </label>
        <p v-if="avatarFailed" class="text-sm text-base-content/65">Зображення недоступне. Показано першу літеру імені.</p>
        <p v-if="error" role="alert" class="text-sm text-error">{{ error }}</p>
        <p v-if="message" role="status" class="text-sm text-success">{{ message }}</p>
        <button type="submit" class="btn btn-neutral w-fit rounded-sm">Зберегти профіль</button>
      </form>
    </div>
  </BasePanel>
</template>
