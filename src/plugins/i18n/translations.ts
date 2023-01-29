import i18n from './index'

// refer to https://github.com/bodrovis-learning/Lokalise-source/blob/master/vue-i18n/src/plugins/Translation.js
const languages: Record<string, { emoji: string; description: string }> = {
  en: { emoji: '🇺🇸', description: 'English' },
  es: { emoji: '🇪🇸', description: 'Español' },
  cn: { emoji: '🇨🇳', description: '简体中文' },
}

export default {
  get supportedLocales() {
    //return ['en', 'es', 'cn']
    return ['en', 'cn']
  },
  get currentLocale() {
    return i18n.global.locale
  },
  set currentLocale(locale) {
    i18n.global.locale = locale
  },
  localeDescription(locale: string): string {
    return languages[locale].description || `${locale} not supported`
  },
  localeEmoji(locale: string): string {
    return languages[locale].emoji || '🤔'
  },
  changeLocale(locale: string) {
    if (!this.isLocaleSupported(locale))
      return Promise.reject(new Error('Locale not supported'))
    if (i18n.global.locale === locale) return Promise.resolve(locale)
    return this.loadLocaleFile(locale).then((msgs) => {
      i18n.global.setLocaleMessage(locale, msgs.default || msgs)
      return this.setI18nLocaleInServices(locale)
    })
  },
  loadLocaleFile(locale: string) {
    return import(`../../locales/${locale}.json`)
  },
  isLocaleSupported(locale: string) {
    return this.supportedLocales.includes(locale)
  },
  setI18nLocaleInServices(locale: any) {
    this.currentLocale = locale
    document.body.setAttribute('lang', locale)
    return locale
  },
}
