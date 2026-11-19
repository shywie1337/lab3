<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="mx-auto max-w-xl border border-base-300 bg-base-100 px-6 py-12 text-center">
    <p class="mb-4 text-sm text-base-content/65">404</p>
    <h1 class="text-3xl font-semibold">Сторінку не знайдено</h1>
    <p class="my-5 text-base-content/65">Такого запису або адреси немає у щоденнику.</p>
    <RouterLink :to="{ name: 'feed' }" class="btn btn-neutral rounded-sm">Повернутися до стрічки</RouterLink>
  </section>
</template>
