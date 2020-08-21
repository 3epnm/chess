import WebSocket from 'ws'
import { LOG_LEVEL } from '../config'
import { ChessDB } from './ChessDB'

export class ChessService {
  private readonly wss: WebSocket.Server
  private readonly database: ChessDB

  public constructor (wss: WebSocket.Server, database: ChessDB) {
    this.wss = wss
    this.database = database
  }

  private broadcast (ws: WebSocket, message: any): void {
    this.wss.clients.forEach((client: any) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message))
      }
    })

    if (LOG_LEVEL > 2) console.log('ChessService', 'broadcast', message)
  }

  private send (ws: WebSocket, message: any): void {
    ws.send(JSON.stringify(message))

    if (LOG_LEVEL > 2) console.log('ChessService', 'send', message)
  }

  public async startGame (ws: WebSocket): Promise<any> {
    const { sessionId, playerId } = await this.database.createSession()

    const head = { action: 'gameStart', sessionId, playerId }

    this.send(ws, Object.assign({ isPlayer: true }, head))
    this.broadcast(ws, Object.assign({ isPlayer: false }, head))
  }

  public async joinGame (ws: WebSocket, message: any): Promise<any> {
    const { sessionId } = message
    const { playerId } = await this.database.joinSession(sessionId)

    const head = { action: 'gameJoin', sessionId, playerId }

    this.send(ws, Object.assign({ isPlayer: true }, head))
    this.broadcast(ws, Object.assign({ isPlayer: false }, head))
  }

  public async quitGame (ws: WebSocket, message: any): Promise<any> {
    const { sessionId } = message
    await this.database.closeSession(sessionId)

    this.send(ws, { action: 'gameQuit', sessionId })
    this.broadcast(ws, { action: 'gameQuit', sessionId })
  }

  public async movePiece (ws: WebSocket, message: any): Promise<any> {
    const { sessionId, playerId, data } = message
    await this.database.movePiece(sessionId, playerId, data)

    this.broadcast(ws, { action: 'pieceMove', sessionId, playerId, data })
  }

  public async disconnect (): Promise<void> {
    return new Promise(resolve => {
      this.wss.clients.forEach((ws: WebSocket) => {
        if (ws.readyState === WebSocket.OPEN) {
          this.send(ws, { action: 'serverShutdown' })
        }
      })

      setTimeout(resolve, 5000)
    })
  }
}
