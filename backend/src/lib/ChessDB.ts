import { MongoClient, ObjectID } from 'mongodb'
import { DB_NAME, LOG_LEVEL } from '../config'

export class ChessDB {
  private readonly client: MongoClient
  private connected: boolean = false
  private db: any

  public constructor (client: MongoClient) {
    this.client = client
  }

  private createObjectID (): string {
    return String(new ObjectID())
  }

  public async createSession (): Promise<any> {
    const sessionId = this.createObjectID()
    const playerId = this.createObjectID()

    await this.db.collection('sessions').insertOne({
      sessionId,
      started: true,
      pending: true,
      players: [{ playerId, timestamp: Date.now(), color: 'w' }],
      moves: [],
      started_at: Date.now()
    })

    const result = { sessionId, playerId }

    if (LOG_LEVEL > 2) console.log('ChessDB', 'createSession', result)

    return result
  }

  public async joinSession (sessionId: string): Promise<any> {
    const playerId = this.createObjectID()

    await this.db.collection('sessions').updateOne({ sessionId }, {
      $addToSet: {
        players: { playerId, TimeStamp: Date.now(), color: 'b' }
      },
      $set: {
        pending: false,
        updated_at: Date.now()
      }
    })

    const result = { sessionId, playerId }

    if (LOG_LEVEL > 2) console.log('ChessDB', 'joinSession', result)

    return result
  }

  public async movePiece (sessionId: string, playerId: string, data: any): Promise<any> {
    const { from, to } = data

    await this.db.collection('sessions').updateOne({ sessionId }, {
      $addToSet: {
        moves: { playerId, from, to, timestamp: Date.now() }
      },
      $set: {
        updated_at: Date.now()
      }
    })

    const result = { sessionId, playerId, data }

    if (LOG_LEVEL > 2) console.log('ChessDB', 'movePiece', result)

    return result
  }

  public async closeSession (sessionId: string): Promise<any> {
    await this.db.collection('sessions').updateOne({ sessionId }, {
      $set: {
        started: false,
        pending: false,
        closed_at: Date.now()
      }
    })

    const result = { sessionId }

    if (LOG_LEVEL > 2) console.log('ChessDB', 'closeSession', result)

    return result
  }

  public async findSession (): Promise<any> {
    const result = await this.db.collection('sessions').find({ started: true }).sort([['started_at', -1]]).limit(1).toArray()
    return result[0]
  }

  public async connect (): Promise<void> {
    try {
      await this.client.connect()
      this.connected = true

      this.db = this.client.db(DB_NAME)
      const hasSessionCollection = await this.db.listCollections({ name: 'sessions' }).toArray()

      if (hasSessionCollection.length < 1) {
        await this.db.createCollection('sessions')
        await this.db.collection('sessions').createIndex({ unique: true })
      }
    } catch (ex) {
      this.connected = false
      throw ex
    }
  }

  public async disconnect (): Promise<void> {
    if (this.connected) {
      const openSessions = await this.db.collection('sessions').find({ started: true }).sort([['started_at', -1]]).limit(1).toArray()

      for (const session of openSessions) {
        await this.closeSession(session.sessionId)
      }

      await this.client.close()
      this.connected = false
    }
  }
}
