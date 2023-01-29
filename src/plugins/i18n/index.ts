import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'

const defaultLocale = 'en'

const i18n = createI18n({
  locale: defaultLocale,
  messages: { en },
  fallbackLocale: defaultLocale,
})

export default i18n
