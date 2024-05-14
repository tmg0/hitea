interface Store {
  state: () => Record<string, any>
  actions: Record<string, any>
}

export const defineStore = <T extends Store>(options: T): T => options

export default defineStore({
  state: () => ({
    socket: {
      client: undefined,
      host: '127.0.0.1',
      port: '5176',
    },

    player: {
      name: '',
    },

    room: {
      players: [],
    },
  }),

  actions: {

  },
})
