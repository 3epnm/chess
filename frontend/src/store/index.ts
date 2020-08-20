import Vue from 'vue'
import Vuex from 'vuex'

import Error from './Error'
import WebSocket from './Chess/WebSocket'
import Chess from './Chess/Chess'
import ChessImages from './Chess/ChessImages'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    Error, Chess, ChessImages, WebSocket
  }
})

store.subscribe((mutation) => {
  switch (mutation.type) {
    case 'SOCKET_ONOPEN':
      store.dispatch('SOCKET_ONOPEN')
      break
    case 'SOCKET_ONCLOSE':
      store.dispatch('SOCKET_ONCLOSE')
      break
    case 'SOCKET_ONERROR':
      store.dispatch('SOCKET_ONERROR')
      break
    case 'SOCKET_RECONNECT':
      store.dispatch('SOCKET_RECONNECT', mutation.payload)
      break
    case 'SOCKET_RECONNECT_ERROR':
      store.dispatch('SOCKET_RECONNECT_ERROR', mutation.payload)
      break
  }
})

export default store
