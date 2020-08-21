import { Router, Request, NextFunction } from 'express'
import { ChessService } from '../lib'
import WebSocket from 'ws'

export const ChessWs = (service: ChessService): Router => {
  const router = Router()

  const onRequest = async (ws: WebSocket, message: string): Promise<void> => {
    const data = JSON.parse(message)
    switch (data.request) {
      case 'startGame':
        await service.startGame(ws).then(() => {})
        break
      case 'joinGame':
        await service.joinGame(ws, data)
        break
      case 'quitGame':
        await service.quitGame(ws, data)
        break
      case 'movePiece':
        await service.movePiece(ws, data)
        break
    }
  }

  router.ws('/session', (ws: WebSocket, req: Request, next: NextFunction) => {
    ws.on('message', (message: string) => {
      onRequest(ws, message).catch(err => next(err))
    })
  })

  return router
}
