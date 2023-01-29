import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from '@/plugins/i18n'
import { createMetaManager } from 'vue-meta'
import ClickOutside from '@/directives/ClickOutside'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

const metaManager = createMetaManager()
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(metaManager)
app.use(i18n)
app.directive('click-outside', ClickOutside)
app.use(FloatingVue, {
  themes: {
    'contract-popover': {
      $extend: 'dropdown',
      $resetCss: true,
    },
  },
})

app.mount('#app')
