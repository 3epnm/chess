import Vue from 'vue'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module
export default class Errors extends VuexModule {
  error: ChessError = {
    sender: '',
    code: 0,
    detail: '',
    message: ''
  }

  connected = false

  @Mutation
  Connected (connected: boolean) {
    this.connected = connected
  }

  @Mutation
  ERROR (error: ChessError) {
    this.error = error

    Vue.prototype.$noty.error(`<b>${error.sender}</b>
      <p>${error.message}</p>
      <small>
        <pre>${error.detail}</pre>
      </small>`)
  }

  @Mutation
  CLEAR_ERROR () {
    this.error = {
      sender: '',
      code: 0,
      detail: '',
      message: ''
    }
  }

  @Mutation
  WARNING (warning: ChessWarning) {
    Vue.prototype.$noty.warning(`<b>${warning.sender}</b>
      <small>
        <pre>${warning.message}</pre>
      </small>`)
  }

  @Action({ commit: 'Connected' })
  SOCKET_ONOPEN () {
    this.context.commit('CLEAR_ERROR')
    return true
  }

  @Action({ commit: 'Connected' })
  SOCKET_ONCLOSE () {
    const payload = { code: 6, sender: 'Chess WebSocket', message: 'Error, unexpected breakup.', detail: 'net::ERR_CONNECTION_DISCONNECTED' }
    if (this.connected) {
      this.context.commit('ERROR', payload)
    }
    return false
  }

  @Action({ commit: 'Connected' })
  SOCKET_ONERROR () {
    return false
  }

  @Action
  SOCKET_RECONNECT (count: number) {
    if (count === 1) {
      const payload = { code: 5, sender: 'Chess WebSocket', message: 'Reconnecting' }
      this.context.commit('WARNING', payload)
    }
  }

  @Action({ commit: 'Connected' })
  SOCKET_RECONNECT_ERROR (close: boolean) {
    const payload = { code: 6, sender: 'Chess WebSocket', message: 'Error while reconnect, give up.', detail: 'net::ERR_CONNECTION_REFUSED' }
    if (close) {
      this.context.commit('ERROR', payload)
      this.context.dispatch('gameQuit')
    }
    return false
  }

  get hasError () { return this.error.code > 0 }
  get Error () { return this.error }
  get isDisabled () { return !this.connected }
}
