import process from 'node:process'
import mri from 'mri'
import type { Socket } from 'socket.io-client'
import ioc from 'socket.io-client'
import consola from 'consola'

const argv = process.argv.slice(2)
const { h: host = '127.0.0.1', p: port = 5176 } = mri(argv)

function connected(client: Socket): Promise<void> {
  return new Promise((resolve) => {
    client.on('connect', () => {
      resolve()
    })
  })
}

function getPlayer(client: Socket): Promise<any> {
  return new Promise((resolve) => {
    client.on('get:player', ({ data }) => {
      resolve(data)
    })
    client.emit('get:player')
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

async function main() {
  const playerName = await consola.prompt('What is your name?')
  const client = ioc(`http://${host}:${port}`, { query: { name: playerName } })
  await connected(client)
  const _player = await getPlayer(client)
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

  client.on('get:room', console.log)
}

main()
