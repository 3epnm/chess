import mongoUnit from 'mongo-unit'
import { MongoClient } from 'mongodb'
import { describe } from 'mocha'
import { expect } from 'chai'
import { ChessDB } from '../src/lib/ChessDB'

describe('ChessDB', function () {
  let sessionId: string = ''
  let player1Id: string = ''
  let player2Id: string = ''

  before(() => {
    return new Promise(resolve => {
      mongoUnit.start().then(() => {
        resolve()
      })
    })
  })

  it('Connect', async function () {
      const client: MongoClient = new MongoClient(mongoUnit.getUrl(), {
        "useNewUrlParser": true,
        "useUnifiedTopology": true
      })
      const db = new ChessDB(client as MongoClient)
      await db.connect()

      expect(client.isConnected()).eq(true)
  })

  it('Create Collections', async function () {
    const client: MongoClient = new MongoClient(mongoUnit.getUrl(), {
      "useNewUrlParser": true,
      "useUnifiedTopology": true
    })
    const db = new ChessDB(client as MongoClient)
    await db.connect()

    const collections = await client.db('chess_db').listCollections({ name: 'sessions' }).toArray()

    expect(collections.length).eq(1)
    expect(collections[0].name).eq('sessions')
  })

  it('Create Session', async function () {
    const client: MongoClient = new MongoClient(mongoUnit.getUrl(), {
      "useNewUrlParser": true,
      "useUnifiedTopology": true
    })
    const db = new ChessDB(client as MongoClient)
    await db.connect()

    const session = await db.createSession()

    expect(session).to.have.property('sessionId')
    expect(session).to.have.property('playerId')

    sessionId = session.sessionId
    player1Id = session.playerId
  })

  it('Session started/pending', async function () {
    const client: MongoClient = new MongoClient(mongoUnit.getUrl(), {
      "useNewUrlParser": true,
      "useUnifiedTopology": true
    })
    const db = new ChessDB(client as MongoClient)
    await db.connect()

    const session = await db.findSession()

    expect(session.sessionId).eq(sessionId)
    expect(session.started).eq(true)
    expect(session.pending).eq(true)
  })

  it('Join Session', async function () {
    const client: MongoClient = new MongoClient(mongoUnit.getUrl(), {
      "useNewUrlParser": true,
      "useUnifiedTopology": true
    })
    const db = new ChessDB(client as MongoClient)
    await db.connect()

    const session = await db.joinSession(sessionId)

    expect(session).to.have.property('sessionId')
    expect(session).to.have.property('playerId')

    expect(session.sessionId).eq(sessionId)
    expect(session.playerId).not.eq(player1Id)

    player2Id = session.playerId
  })

  it('Session started/running', async function () {
    const client: MongoClient = new MongoClient(mongoUnit.getUrl(), {
      "useNewUrlParser": true,
      "useUnifiedTopology": true
    })
    const db = new ChessDB(client as MongoClient)
    await db.connect()

    const session = await db.findSession()

    expect(session.sessionId).eq(sessionId)
    expect(session.started).eq(true)
    expect(session.pending).eq(false)
  })

  it('Make moves', async function () {
    const client: MongoClient = new MongoClient(mongoUnit.getUrl(), {
      "useNewUrlParser": true,
      "useUnifiedTopology": true
    })
    const db = new ChessDB(client as MongoClient)
    await db.connect()

    const a = await db.movePiece(sessionId, player1Id, { from: 'e2', to: 'e4' })
    expect(a.sessionId).eq(sessionId)

    const b = await db.movePiece(sessionId, player2Id, { from: 'd8', to: 'f5' })
    expect(b.sessionId).eq(sessionId)
  })

  it('Find Session', async function () {
    const client: MongoClient = new MongoClient(mongoUnit.getUrl(), {
      "useNewUrlParser": true,
      "useUnifiedTopology": true
    })
    const db = new ChessDB(client as MongoClient)
    await db.connect()

    const session = await db.findSession()

    expect(session.players[0].playerId).eq(player1Id)
    expect(session.players[0].color).eq('w')
    expect(session.moves[0].playerId).eq(player1Id)
    expect(session.moves[0].from).eq('e2')
    expect(session.moves[0].to).eq('e4')

    expect(session.players[1].playerId).eq(player2Id)
    expect(session.players[1].color).eq('b')
    expect(session.moves[1].playerId).eq(player2Id)
    expect(session.moves[1].from).eq('d8')
    expect(session.moves[1].to).eq('f5')
  })

  it('Close Session', async function () {
    const client: MongoClient = new MongoClient(mongoUnit.getUrl(), {
      "useNewUrlParser": true,
      "useUnifiedTopology": true
    })
    const db = new ChessDB(client as MongoClient)
    await db.connect()

    const session = await db.closeSession(sessionId)
    expect(session.sessionId).eq(sessionId)
  })

  it('Closed Session', async function () {
    const client: MongoClient = new MongoClient(mongoUnit.getUrl(), {
      "useNewUrlParser": true,
      "useUnifiedTopology": true
    })
    const db = new ChessDB(client as MongoClient)
    await db.connect()

    const session = await db.findSession()
    expect(session).to.be.undefined
  })

  it('Disconnect', async function () {
    const client: MongoClient = new MongoClient(mongoUnit.getUrl(), {
      "useNewUrlParser": true,
      "useUnifiedTopology": true
    })
    const db = new ChessDB(client as MongoClient)
    await db.connect()

    await db.createSession()
    const session = await db.disconnect()
    expect(session).to.be.undefined
  })

  it('Disconnected', async function () {
    const client: MongoClient = new MongoClient(mongoUnit.getUrl(), {
      "useNewUrlParser": true,
      "useUnifiedTopology": true
    })
    const db = new ChessDB(client as MongoClient)
    await db.connect()

    const session = await db.findSession()
    expect(session).to.be.undefined
  })

  after(() => {
    mongoUnit.stop()
  })
})