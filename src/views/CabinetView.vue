<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'

const auth = useAuthStore()
</script>

<template>
  <div class="mb-6">
    <h1 class="text-3xl font-semibold">Особистий кабінет</h1>
    <p class="mt-2 text-base-content/65">Ви увійшли як {{ auth.nickname }}.</p>
  </div>
  <nav aria-label="Розділи кабінету" class="mb-6 flex flex-wrap gap-2 border-b border-base-300 pb-4">
    <RouterLink :to="{ name: 'new-trip' }" class="btn btn-ghost rounded-sm" active-class="btn-active">Нова подорож</RouterLink>
    <RouterLink :to="{ name: 'profile' }" class="btn btn-ghost rounded-sm" active-class="btn-active">Профіль</RouterLink>
  </nav>
  <RouterView />
</template>
