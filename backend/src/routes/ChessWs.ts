import { Router } from 'express'
import { ChessService } from '../lib'
import WebSocket from 'ws'

export const ChessWs = (service: ChessService): Router => {
  const router = Router()

  router.ws('/session', (ws: WebSocket) => {
    ws.on('message', (message: string) => {
      const data = JSON.parse(message)

      switch (data.request) {
        case 'startGame':
          service.startGame(ws)
          break
        case 'joinGame':
          service.joinGame(ws, data)
          break
        case 'quitGame':
          service.quitGame(ws, data)
          break
        case 'movePiece':
          service.movePiece(ws, data)
          break
      }
    })
  })

  return router
}
