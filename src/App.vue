<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import { useDiaryPersistence } from './composables/useDiaryPersistence'

const darkTheme = ref(false)
const { storageError } = useDiaryPersistence()
</script>

<template>
  <div :data-theme="darkTheme ? 'dark' : 'light'" class="min-h-screen bg-base-200 text-base-content">
    <AppHeader :dark-theme="darkTheme" @toggle-theme="darkTheme = !darkTheme" />
    <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <p v-if="storageError" role="alert" class="alert alert-warning mb-6 rounded-sm">
        Не вдалося зберегти зміни в браузері. Перевірте, чи дозволено локальне сховище.
      </p>
      <RouterView />
    </main>
  </div>
</template>
