import { computed, watch, ref } from 'vue'
import { defineStore } from 'pinia'
import { lsGet } from '@/utils/localStorage'

const DARK = 'dark'
const LIGHT = 'light'
const defaultTheme = DARK

export const useThemeStore = defineStore('theme', () => {
  const userTheme = ref(lsGet('theme') || defaultTheme)

  const theme = computed(() =>
    [DARK, LIGHT].includes(userTheme.value) ? userTheme.value : defaultTheme
  )

  const themeIcon = computed(() => {
    return theme.value === DARK ? 'sun.svg' : 'half-moon.svg'
  })

  watch(
    theme,
    () => {
      document.documentElement.setAttribute(
        'data-theme',
        theme.value === LIGHT ? LIGHT : DARK
      )
    },
    { immediate: true }
  )

  function toggleTheme() {
    if (userTheme.value === LIGHT) {
      userTheme.value = DARK
    } else {
      userTheme.value = LIGHT
    }
  }

  return { theme, themeIcon, toggleTheme }
})
