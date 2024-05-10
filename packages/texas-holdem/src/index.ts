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
  const query = getQuery<ConnectionQuery>(socket)
  const key = `player:${query.name}`
  const cache = await storage.getItem(key)
  const player = cache ?? new Player({ id: socket.id, name: query.name })

  socket.on('get:rooms', () => {
    socket.emit('get:rooms', rooms.map(({ data }) => data))
  })

  socket.on('post:room', (data: Partial<Room> = {}) => {
    const room = new Room({ ...data, game: new TexasHoldem() })
    rooms.push(room)
    room.game.join(player)
    socket.join(room.id)
    io.to(room.id).emit('get:room', new Response(room.data))
  })

  socket.on('post:room.game.player', (data: { roomId: string }) => {
    const room = rooms.find(({ id }) => id === data.roomId)
    if (!room)
      return
    room.game.join(player)
    socket.join(room.id)
    io.to(room.id).emit('get:room', new Response(room.data))
  })
})

io.listen(PORT)
