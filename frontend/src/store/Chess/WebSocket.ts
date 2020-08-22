import Vue from 'vue'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module
export default class WebSocket extends VuexModule implements WebSocketStore {
  socket: ChessSocketState = {
    isConnected: false,
    isShutdown: false,
    reconnectError: false
  }

  @Mutation
  SOCKET_ONOPEN (ev: Event) {
    Vue.prototype.$socket = ev.currentTarget
    this.socket.isConnected = true
    this.socket.isShutdown = false
  }

  @Mutation
  SOCKET_ONCLOSE () {
    this.socket.isConnected = false
  }

  @Mutation
  SOCKET_ONERROR () {
    this.socket.isConnected = false
  }

  @Mutation
  SOCKET_RECONNECT () {
    this.socket.isConnected = false
  }

  @Mutation
  SOCKET_RECONNECT_ERROR (close: boolean) {
    this.socket.isConnected = false
    if (close) {
      this.socket.reconnectError = true
    }
  }

  @Mutation
  REQUEST (request: ChessSocketRequest) {
    if (this.socket.isConnected) {
      Vue.prototype.$socket.sendObj(request)
    }
  }

  @Action
  serverShutdown () {
    if (!this.socket.isShutdown) {
      this.socket.isShutdown = true
      this.socket.isConnected = false

      this.context.commit('WARNING', {
        sender: 'Chess Server Shutdown',
        message: 'Chess server shuts down.'
      })
    }
  }

  get Socket () {
    return this.socket
  }
}
