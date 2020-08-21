import axios from 'axios'
import ChessRules from './lib/ChessRules'

import { CONFIG_API } from '../../config'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module
export default class Chess extends VuexModule implements ChessStore {
  pieces: ChessPiece[] = []
  fields: ChessField[] = []

  lastColor: ChessPieceColors = 'b'
  movingPosition?: ChessBoardPositions = undefined

  game: ChessGame = {
    sessionId: undefined,
    started: false,
    pending: true
  }

  player: ChessPlayer = {
    isPlayer: false,
    isVisitor: false
  }

  sessionLoaded = false

  @Mutation
  GAME_START (data: GameInit) {
    this.game = {
      sessionId: data.sessionId,
      started: true,
      pending: true
    }
    if (data.isPlayer) {
      this.player = {
        playerId: data.playerId,
        isPlayer: true,
        isVisitor: false,
        color: 'w'
      }
    }
  }

  @Mutation
  GAME_JOIN (data: GameInit) {
    this.game = {
      sessionId: data.sessionId,
      started: true,
      pending: false
    }
    if (data.isPlayer) {
      this.player = {
        playerId: data.playerId,
        isPlayer: true,
        isVisitor: false,
        color: 'b'
      }
    }
    if (!this.player.isPlayer) {
      this.player.isVisitor = true
    }
  }

  @Mutation
  GAME_QUIT () {
    this.game = {
      sessionId: '',
      started: false,
      pending: false
    }
    this.player = {
      playerId: '',
      isPlayer: false,
      isVisitor: false,
      color: undefined
    }
    this.lastColor = 'b'
  }

  @Mutation
  MOVING_PIECE (data: ChessBoardPositions) {
    this.movingPosition = data
  }

  @Mutation
  MOVE_PIECE (data: ChessMove) {
    const cur = this.pieces.find((piece: ChessPiece) => piece.pos === data.from)
    const opp = this.pieces.find((piece: ChessPiece) => piece.pos === data.to)

    if (cur) {
      cur.pos = data.to
      this.lastColor = cur.color
    }

    if (opp) {
      const oppIdx = this.pieces.findIndex((piece: ChessPiece) => piece.key === opp.key)
      this.pieces.splice(oppIdx, 1)
    }
  }

  @Mutation
  SESSION_LOADED (isLoaded: boolean) {
    this.sessionLoaded = isLoaded
  }

  @Mutation
  INIT_PIECES () {
    this.pieces = []

    const init = [
      { row: 8, color: 'b', pieces: 'rnbqkbnr' },
      { row: 7, color: 'b', pieces: 'pppppppp' },
      { row: 2, color: 'w', pieces: 'pppppppp' },
      { row: 1, color: 'w', pieces: 'rnbqkbnr' }
    ]

    let id = 0
    for (const item of init) {
      const row = item.row as ChessFieldRows
      const color = item.color as ChessPieceColors

      let idx = 0
      for (const piece of item.pieces.split('')) {
        const name = piece as ChessPieceNames
        const col = 'abcdefgh'.substr(idx++, 1) as ChessFieldColumns
        const key = name + (id++)
        const pos = (col + row) as ChessBoardPositions
        this.pieces.push({ key, pos, name, color })
      }
    }
  }

  @Mutation
  INIT_FIELDS () {
    this.fields = []

    for (let row = 8; row > 0; row--) {
      for (const col of 'abcdefgh'.split('')) {
        const pos = (col + row) as ChessBoardPositions
        const key = 'f' + pos
        this.fields.push({ key, pos })
      }
    }
  }

  @Action({ commit: 'SESSION_LOADED' })
  async init () {
    this.context.commit('INIT_PIECES')
    this.context.commit('INIT_FIELDS')

    try {
      const { status, data } = await axios.get(CONFIG_API)

      if (status === 200) {
        for (const move of data.moves) {
          this.context.commit('MOVE_PIECE', move)
        }

        this.game.sessionId = data.sessionId
        this.game.started = data.started
        this.game.pending = data.pending

        if (!data.pending) {
          this.player.isPlayer = false
          this.player.isVisitor = true
        }
      }

      return true
    } catch (err) {
      this.context.commit('ERROR', { code: 1, sender: 'Chess API', message: 'Chess API not responding.', detail: 'Network Error', raw: err })
      return false
    }
  }

  @Action
  startGame () {
    this.context.commit('REQUEST', { request: 'startGame' })
  }

  @Action({ commit: 'GAME_START' })
  gameStart (data: GameInit) {
    return data
  }

  @Action
  joinGame () {
    this.context.commit('REQUEST', { request: 'joinGame', sessionId: this.game.sessionId })
  }

  @Action({ commit: 'GAME_JOIN' })
  gameJoin (data: GameInit) {
    return data
  }

  @Action
  quitGame () {
    this.context.commit('REQUEST', { request: 'quitGame', sessionId: this.game.sessionId })
  }

  @Action
  gameQuit () {
    this.context.commit('GAME_QUIT')
    this.context.commit('INIT_PIECES')
    this.context.commit('INIT_FIELDS')
  }

  @Action
  quitGameIfPlayer () {
    if (this.player.isPlayer) {
      this.context.dispatch('quitGame')
    }
  }

  @Action
  startMoving (data: string) {
    this.context.commit('MOVING_PIECE', data)
  }

  @Action
  endMoving () {
    this.context.commit('MOVING_PIECE', '')
  }

  @Action
  movePiece (data: ChessMove) {
    const allowed = ChessRules.validateMove(this.context.state as ChessStore, data)

    if (allowed) {
      this.context.commit('MOVE_PIECE', data)
      this.context.commit('REQUEST', { request: 'movePiece', sessionId: this.game.sessionId, playerId: this.player.playerId, data })
    }
  }

  @Action({ commit: 'MOVE_PIECE' })
  pieceMove (data: GameMove) {
    return data.data
  }

  @Action
  validateMove (to: ChessBoardPositions) {
    const from = this.movingPosition
    return ChessRules.validateMove(this.context.state as ChessStore, { from, to }) || ChessRules.isSame({ from, to })
  }

  get SessionLoaded () { return this.sessionLoaded }
  get Pieces () { return this.pieces }
  get Fields () { return this.fields }
  get Player () { return this.player }
  get isStarted () { return this.game.started }
  get isPending () { return this.game.pending }
  get isPlayer () { return this.player.isPlayer }
  get isVisitor () { return this.player.isVisitor }

  get isTurn () {
    if (!this.game.pending && this.player.isPlayer && this.player.color !== this.lastColor) {
      return true
    }
    return false
  }
}
