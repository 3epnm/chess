import Vue from 'vue'
import VueNoty from 'vuejs-noty'
import VueNativeSock from 'vue-native-websocket'
import GetTextPlugin from 'vue-gettext'
import translations from './translations/translations.json'

import App from './App.vue'
import router from './router'
import store from './store'

import { CONFIG_WS } from './config'

Vue.use(GetTextPlugin, {
  translations,
  /* eslint-disable @typescript-eslint/camelcase */
  availableLanguages: {
    en_GB: 'British English'
  },
  defaultLanguage: 'en_GB'
  /* eslint-enable */
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
  router,
  store,
  created: () => window.addEventListener('beforeunload', () => store.dispatch('quitGameIfPlayer')),
  render: h => h(App)
}).$mount('#app')
