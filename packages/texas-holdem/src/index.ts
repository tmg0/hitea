import type { Socket } from 'socket.io'
import { Server } from 'socket.io'
import { PORT } from './consts'
import { Room } from './models/room'
import { TexasHoldem } from './models/game'
import { storage } from './storage'
import { Player } from './models/player'
import { getQuery } from './utils'

const rooms: Room[] = []

interface ConnectionQuery {
  name: string
}

const io = new Server({ cors: { origin: '*' } })

class Response {
  constructor(
    public data: any = {},
  ) {}
}

function onExit(socket: Socket, player: Player, room?: Room) {
  if (!room)
    return
  room.game.exit(player)
  socket.leave(room.id)
  io.to(room.id).emit('room:get', new Response(room.data))
  if (!room.game.isEmpty)
    return
  const _id = room.id
  const _idx = rooms.findIndex(({ id }) => id === _id)
  if (_idx < 0)
    return
  rooms.splice(_idx, 1)
}

io.on('connection', async (socket) => {
  let room: Room | undefined
  const query = getQuery<ConnectionQuery>(socket)
  const key = `db:${query.name}`
  const cache: Partial<Player> = (await storage.getItem(key)) ?? {}
  const player = new Player({ ...cache, id: socket.id, name: query.name })
  await storage.setItem(key, player.data)

  socket.on('disconnect', () => {
    onExit(socket, player, room)
  })

  socket.on('room:list', () => {
    socket.emit('room:list', new Response(rooms.map(({ data }) => data)))
  })

  socket.on('player:get', () => {
    socket.emit('player:get', new Response(player.data))
  })

  socket.on('room:create', (data: Partial<Room> = {}) => {
    if (room)
      return
    room = new Room({ ...data, game: new TexasHoldem() })
    rooms.push(room)
    room.game.join(player)
    socket.join(room.id)
    io.to(room.id).emit('room:get', new Response(room.data))
  })

  socket.on('game:join', (data: { roomId: string }) => {
    if (room)
      onExit(socket, player, room)
    room = rooms.find(({ id }) => id === data.roomId)
    if (!room)
      return
    room.game.join(player)
    socket.join(room.id)
    io.to(room.id).emit('room:get', new Response(room.data))
  })

  socket.on('room:exit', () => {
    onExit(socket, player, room)
    room = undefined
  })

  socket.on('game:start', () => {
    if (!room)
      return
    room.game.start()
    io.to(room.id).emit('game:start')
    io.to(room.id).emit('room:get', new Response(room.data))
  })

  socket.on('message:send', (content: string) => {
    if (!room)
      return
    io.to(room.id).emit('message:get', new Response({ from: player.name, content }))
  })
})

io.listen(PORT)
