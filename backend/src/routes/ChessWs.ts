import { Router, Request, NextFunction } from 'express'
import { ChessService } from '../lib'
import WebSocket from 'ws'

export const ChessWs = (service: ChessService): Router => {
  const router = Router()

  router.ws('/session', (ws: WebSocket, req: Request, next: NextFunction) => {
    ws.on('message', (message: string) => {
      service.onRequest(ws, message).catch(err => next(err))
    })
  })

  return router
}
