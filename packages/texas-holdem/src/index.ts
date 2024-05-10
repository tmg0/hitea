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

io.on('connection', async (socket) => {
  let room: Room | undefined
  const query = getQuery<ConnectionQuery>(socket)
  const key = `db:${query.name}`
  const cache: Partial<Player> = (await storage.getItem(key)) ?? {}
  const player = new Player({ ...cache, id: socket.id, name: query.name })
  await storage.setItem(key, player.data)

  socket.on('get:rooms', () => {
    socket.emit('get:rooms', new Response(rooms.map(({ data }) => data)))
  })

  socket.on('get:player', () => {
    socket.emit('get:player', new Response(player.data))
  })

  socket.on('post:room', (data: Partial<Room> = {}) => {
    if (room)
      return
    room = new Room({ ...data, game: new TexasHoldem() })
    rooms.push(room)
    room.game.join(player)
    socket.join(room.id)
    io.to(room.id).emit('get:room', new Response(room.data))
  })

  socket.on('post:room.game.player', (data: { roomId: string }) => {
    room = rooms.find(({ id }) => id === data.roomId)
    if (!room)
      return
    room.game.join(player)
    socket.join(room.id)
    io.to(room.id).emit('get:room', new Response(room.data))
  })

  socket.on('delete:room.game.player', () => {
    if (!room)
      return
    room.game.leave(player)
    socket.leave(room.id)
    io.to(room.id).emit('get:room', new Response(room.data))
    if (!room.game.isEmpty)
      return
    const _id = room.id
    const _idx = rooms.findIndex(({ id }) => id === _id)
    if (_idx < 0)
      return
    rooms.splice(_idx, 1)
  })

  socket.on('post:message', (data: any) => {
    if (!room)
      return
    io.to(room.id).emit('get:message', new Response(data))
  })
})

io.listen(PORT)
