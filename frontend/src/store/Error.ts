import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module
export default class Errors extends VuexModule implements ErrorStore {
  error: ChessError = {
    code: 0
  }

  warning: ChessWarning = { }

  isCodeSend = 0

  @Mutation
  CLEAR () {
    this.error = { code: 0 }
    this.warning = { }
    this.isCodeSend = 0
  }

  @Mutation
  CLEAR_ERROR () {
    this.error = { code: 0 }
  }

  @Mutation
  SET_CODE_SEND (code: number) {
    this.isCodeSend = code
  }

  @Mutation
  ERROR (error: ChessError) {
    this.error = error
  }

  @Mutation
  WARNING (warning: ChessWarning) {
    this.warning = warning
  }

  @Action
  SOCKET_ONOPEN () {
    this.context.commit('CLEAR')
  }

  @Action
  SOCKET_ONCLOSE () {
    if (!this.context.getters.Socket.isShutdown && this.isCodeSend !== 6) {
      this.context.commit('ERROR', {
        code: 6,
        sender: 'Chess WebSocket',
        message: 'Error, unexpected breakup.',
        detail: 'net::ERR_CONNECTION_DISCONNECTED'
      })
      this.context.commit('SET_CODE_SEND', 6)
    }
  }

  @Action
  SOCKET_RECONNECT (count: number) {
    this.context.commit('CLEAR_ERROR')
    this.context.commit('WARNING', {
      sender: 'Chess WebSocket',
      message: `Connecting, ${count}. attempt.`
    })
  }

  @Action
  SOCKET_RECONNECT_ERROR (close: boolean) {
    if (close) {
      this.context.commit('ERROR', {
        code: 6,
        sender: 'Chess WebSocket',
        message: 'Error while reconnect, give up.',
        detail: 'net::ERR_CONNECTION_REFUSED'
      })
      this.context.dispatch('gameQuit')
    }
  }

  get Error () { return this.error }
  get Warning () { return this.warning }
}
