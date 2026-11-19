<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'

defineProps<{ darkTheme: boolean }>()
const emit = defineEmits<{ (event: 'toggle-theme'): void }>()
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

async function logout() {
  if (route.name === 'feed') {
    auth.logout()
    return
  }

  const result = await router.push({ name: 'feed' })
  if (!result) {
    auth.logout()
  }
}
</script>

<template>
  <header class="border-b border-base-300 bg-base-100">
    <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
      <RouterLink :to="{ name: 'feed' }" class="text-lg font-bold tracking-tight">Щоденник подорожей</RouterLink>
      <nav aria-label="Головна навігація" class="flex flex-wrap items-center gap-2">
        <RouterLink :to="{ name: 'feed' }" class="btn btn-ghost btn-sm rounded-sm" exact-active-class="btn-active">Стрічка</RouterLink>
        <RouterLink to="/cabinet" class="btn btn-ghost btn-sm rounded-sm" active-class="btn-active">Кабінет</RouterLink>
        <button type="button" class="btn btn-ghost btn-sm rounded-sm" :aria-pressed="darkTheme" @click="emit('toggle-theme')">
          {{ darkTheme ? 'Світла тема' : 'Темна тема' }}
        </button>
        <button v-if="auth.isLoggedIn" type="button" class="btn btn-outline btn-sm rounded-sm" @click="logout">Вийти</button>
        <RouterLink v-else :to="{ name: 'login' }" class="btn btn-neutral btn-sm rounded-sm">Увійти</RouterLink>
      </nav>
    </div>
  </header>
</template>
