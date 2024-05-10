import { beforeAll, describe, expect, it } from 'vitest'
import ioc, { type Socket } from 'socket.io-client'

describe('socket', () => {
  let client!: Socket
  let connected = false

  beforeAll(() => {
    return new Promise((resolve) => {
      client = ioc('http://127.0.0.1:5176', { query: { name: 'tmg0' } })
      client.on('connect', () => {
        connected = true
        resolve()
      })
    })
  })

  it('should be connected', () => {
    expect(connected).toBe(true)
  })

  it('should get rooms', () => {
    return new Promise((resolve) => {
      client.on('get:rooms', (rooms) => {
        expect(!!rooms.data).toBe(true)
        resolve(rooms)
      })

      client.emit('get:rooms')
    })
  })

  it('should create a new room', () => {
    return new Promise((resolve) => {
      client.on('get:room', (room) => {
        expect(room.data.game.players.length > 0).toBe(true)
        resolve(room)
      })

      client.emit('post:room', { name: 'Room 1' })
    })
  })
})
