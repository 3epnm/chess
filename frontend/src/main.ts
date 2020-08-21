import Vue from 'vue'
import VueNoty from 'vuejs-noty'
import VueNativeSock from 'vue-native-websocket'
import VueI18n, { LocaleMessages } from 'vue-i18n'

import App from './App.vue'
import router from './router'
import store from './store'

import { CONFIG_WS } from './config'
import translations from './translations.json'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'en',
  messages: translations as LocaleMessages
})

Vue.use(VueNoty, {
  timeout: 3000,
  progressBar: true,
  layout: 'bottomCenter'
})

Vue.use(VueNativeSock, CONFIG_WS, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
  store,
  format: 'json'
})

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  created: () => window.addEventListener('beforeunload', () => store.dispatch('quitGameIfPlayer')),
  render: h => h(App)
}).$mount('#app')
