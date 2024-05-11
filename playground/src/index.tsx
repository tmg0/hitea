import process from 'node:process'
import { render } from 'ink'
import React from 'react'
import mri from 'mri'
import type { Socket } from 'socket.io-client'
import ioc from 'socket.io-client'
import consola from 'consola'
import App from './App'

const argv = process.argv.slice(2)
const { h: host, p: port, n: name } = mri(argv)

function connected(client: Socket): Promise<void> {
  return new Promise((resolve) => {
    client.on('connect', () => {
      resolve()
    })
  })
}

function getRooms(client: Socket): Promise<any[]> {
  return new Promise((resolve) => {
    client.on('get:rooms', ({ data }) => {
      resolve(data)
    })
    client.emit('get:rooms')
  })
}

async function roomEventLoop(client: Socket) {
  const rooms = await getRooms(client)
  const roomId = await consola.prompt('Join the room or create a new one', {
    type: 'select',
    options: [
      { label: 'New', value: '' },
      ...rooms.map(({ name, id }) => ({ label: name, value: id })),
    ],
  })

  if (!roomId) {
    const roomName = await consola.prompt('Room name:')
    client.emit('post:room', { name: roomName })
  }

  if (roomId)
    client.emit('post:room.game.player', { roomId })

  const event = await consola.prompt('Action:', {
    type: 'select',
    options: ['Start', 'Exit'],
  })

  if (event === 'Start')
    return

  client.emit('delete:room.game.player')
  await roomEventLoop(client)
}

async function main() {
  const playerName = name || (await consola.prompt('What is your name?'))
  const client = ioc(`http://${host}:${port}`, { query: { name: playerName } })
  await connected(client)
  await roomEventLoop(client)
  render(<App />)
}

main()
