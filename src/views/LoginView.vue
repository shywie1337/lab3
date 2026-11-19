<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'

const auth = useAuthStore()
const nickname = ref('')
const error = ref('')
const route = useRoute()
const router = useRouter()

function login() {
  if (!nickname.value.trim()) {
    error.value = 'Введіть нікнейм.'
    return
  }
  auth.login(nickname.value)
  const redirect = route.query.redirect
  if (typeof redirect === 'string' && (redirect === '/cabinet' || redirect.startsWith('/cabinet/'))) {
    router.replace(redirect)
  } else {
    router.replace('/cabinet')
  }
}
</script>

<template>
  <section class="mx-auto max-w-md rounded-sm border border-base-300 bg-base-100 p-6 sm:mt-8">
    <h1 class="text-2xl font-semibold">Вхід до кабінету</h1>
    <p class="mt-3 text-sm leading-relaxed text-base-content/65">Вкажіть нікнейм, щоб додавати подорожі та редагувати профіль. Вхід діє в поточній вкладці.</p>
    <form class="mt-6 grid gap-5" @submit.prevent="login">
      <label class="grid gap-2 text-sm font-medium">
        Нікнейм
        <input v-model="nickname" name="nickname" autocomplete="username" required maxlength="40" class="input w-full rounded-sm" />
      </label>
      <p v-if="error" role="alert" class="text-sm text-error">{{ error }}</p>
      <button class="btn btn-neutral rounded-sm" type="submit">Увійти</button>
    </form>
  </section>
</template>
