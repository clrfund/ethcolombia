import { defineStore } from 'pinia'
import translations from '@/plugins/i18n/translations'
import { lsGet, lsSet } from '@/utils/localStorage'

const localeKey = 'locale'

export const useLocaleStore = defineStore('locale', () => {
  async function loadLocale() {
    const savedLocale = lsGet(localeKey, translations.currentLocale)
    translations.changeLocale(savedLocale)
  }

  async function changeLocale(locale: string) {
    await translations.changeLocale(locale)
    lsSet(localeKey, locale)
  }
  return { loadLocale, changeLocale }
})
