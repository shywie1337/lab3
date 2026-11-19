import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(sessionStorage.getItem('travel-token') ?? '')
  const nickname = ref(sessionStorage.getItem('travel-nickname') ?? '')
  const isLoggedIn = computed(() => token.value.length > 0)

  function login(name: string) {
    token.value = 'signed-in'
    nickname.value = name.trim()
    sessionStorage.setItem('travel-token', token.value)
    sessionStorage.setItem('travel-nickname', nickname.value)
  }

  function logout() {
    token.value = ''
    nickname.value = ''
    sessionStorage.removeItem('travel-token')
    sessionStorage.removeItem('travel-nickname')
  }

  return { nickname, isLoggedIn, login, logout }
})
