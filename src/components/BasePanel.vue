<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <section class="rounded-sm border border-base-300 bg-base-100 p-5 sm:p-6">
    <h2 class="mb-5 text-xl font-semibold">{{ title }}</h2>
    <slot />
  </section>
</template>
