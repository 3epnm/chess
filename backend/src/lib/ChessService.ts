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
    if (ws.readyState !== WebSocket.OPEN) return

    ws.send(JSON.stringify(message))

    if (LOG_LEVEL > 2) console.log('ChessService', 'send', message)
  }

  public async onRequest (ws: WebSocket, message: string): Promise<void> {
    const data = JSON.parse(message)
    switch (data.request) {
      case 'startGame':
        await this.startGame(ws)
        break
      case 'joinGame':
        await this.joinGame(ws, data)
        break
      case 'quitGame':
        await this.quitGame(ws, data)
        break
      case 'movePiece':
        await this.movePiece(ws, data)
        break
    }
  }

  private async startGame (ws: WebSocket): Promise<void> {
    const { sessionId, playerId } = await this.database.createSession()

    const head = { action: 'gameStart', sessionId, playerId }

    this.send(ws, Object.assign({ isPlayer: true }, head))
    this.broadcast(ws, Object.assign({ isPlayer: false }, head))
  }

  private async joinGame (ws: WebSocket, message: any): Promise<void> {
    const { sessionId } = message
    const { playerId } = await this.database.joinSession(sessionId)

    const head = { action: 'gameJoin', sessionId, playerId }

    this.send(ws, Object.assign({ isPlayer: true }, head))
    this.broadcast(ws, Object.assign({ isPlayer: false }, head))
  }

  private async quitGame (ws: WebSocket, message: any): Promise<void> {
    const { sessionId } = message
    await this.database.closeSession(sessionId)

    this.send(ws, { action: 'gameQuit', sessionId })
    this.broadcast(ws, { action: 'gameQuit', sessionId })
  }

  private async movePiece (ws: WebSocket, message: any): Promise<void> {
    const { sessionId, playerId, data } = message
    await this.database.movePiece(sessionId, playerId, data)

    this.broadcast(ws, { action: 'pieceMove', sessionId, playerId, data })
  }

  public async disconnect (): Promise<void> {
    return await new Promise(resolve => {
      this.wss.clients.forEach((ws: WebSocket) => {
        if (ws.readyState === WebSocket.OPEN) {
          this.send(ws, { action: 'serverShutdown' })
        }
      })
      let i = 4
      if (LOG_LEVEL > 1) setInterval(() => console.log(i--), 1000)
      setTimeout(resolve, 5000)
    })
  }
}
