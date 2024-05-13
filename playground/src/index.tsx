import process from 'node:process'
import { render } from 'ink'
import React from 'react'
import mri from 'mri'
import type { Socket } from 'socket.io-client'
import ioc from 'socket.io-client'
import consola from 'consola'
import App from './App'
import SocketProvider from './components/SocketProvider'

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
    client.on('room:list', ({ data }) => {
      resolve(data)
    })
    client.emit('room:list')
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
    client.emit('room:create', { name: roomName })
  }

  if (roomId)
    client.emit('game:join', { roomId })

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
  render(
    <SocketProvider host={host} port={port} name={name}>
      <App />
    </SocketProvider>,
  )
}

main()
