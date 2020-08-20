import express from 'express'
import espressWs from 'express-ws'
import cors from 'cors'

import { MongoClient } from 'mongodb'

import { ChessDB, ChessService } from './lib'
import { ChessApi, ChessWs } from './routes'

import { LISTEN_PORT, DB_URI, LOG_LEVEL } from './config'

process.stdin.resume()

const main = async () => {
  const app = express()
  const wsInstance = espressWs(app)
  const wss = wsInstance.getWss()

  const client = new MongoClient(DB_URI, {
    "useNewUrlParser": true,
    "useUnifiedTopology": true
  })

  const database = new ChessDB(client)
  await database.connect()

  const service = new ChessService(wss, database)

  app.use(cors())
  app.use('/api/', ChessApi(database))
  app.use('/websocket/', ChessWs(service))

  app.listen(LISTEN_PORT, () => {
    if (LOG_LEVEL > 1) console.log(`Server listening on port ${LISTEN_PORT}`)
  })

  let terminating = false
  const onExit = async () => {
    if (terminating) {
      return
    }
    terminating = true

    console.log('')

    if (LOG_LEVEL > 1) console.log(`Teardown`)

    await service.disconnect()
    await database.disconnect()

    if (LOG_LEVEL > 1) console.log(`Exit`)

    process.exit();
  }

  process.on('SIGUSR1', onExit);
  process.on('SIGUSR2', onExit);
  process.on('SIGTERM', onExit);
  process.on('SIGINT', onExit);
}

main()
