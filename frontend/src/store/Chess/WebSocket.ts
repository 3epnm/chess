import Vue from 'vue'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module
export default class WebSocket extends VuexModule {
  socket: ChessSocketState = {
    isConnected: false,
    isShutdown: false,
    reconnectError: false
  }

  @Action
  serverShutdown () {
    if (this.socket.isShutdown) return

    this.socket.isShutdown = true
    this.socket.isConnected = false

    this.context.commit('WARNING', { sender: 'Chess Server Shutdown', message: 'Chess server shuts down.' })
    this.context.dispatch('gameQuit')
  }

  @Mutation
  SOCKET_ONOPEN (ev: Event) {
    Vue.prototype.$socket = ev.currentTarget
    this.socket.isConnected = true
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
    if (!this.socket.isConnected) return

    Vue.prototype.$socket.sendObj(request)
  }

  get Socket () { return this.socket }
}
