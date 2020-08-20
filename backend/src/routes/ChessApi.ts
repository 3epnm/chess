import express, { Request, Response, Router } from 'express'
import { ChessDB } from '../lib'

export const ChessApi = (database: ChessDB): Router => {
  const router = Router()
  router.use(express.json())

  router.get('/session/latest', async (req: Request, res: Response) => {
    if (!req) return

    const result = await database.findSession()

    if (result === undefined) {
      res.status(204).send('No Content')
    } else {
      res.json(result)
    }
  })

  return router
}
