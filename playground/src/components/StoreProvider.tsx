import process from 'node:process'
import type { PropsWithChildren } from 'react'
import React, { createContext, useEffect, useMemo, useState } from 'react'
import type { Socket } from 'socket.io-client'
import ioc from 'socket.io-client'
import mri from 'mri'
import useRouter from '../hooks/useRouter'

interface Context {
  name: string
  input: string
  room: any
  messages: any[]
  client?: Socket
  isConnected: boolean
  isRoomOwner: boolean
  setName?: (value: string) => void
  setInput?: (value: string) => void
  clearChat?: () => void
}

const defaults = {
  name: '',
  input: '',
  room: {},
  messages: [],
  client: undefined,
  isConnected: false,
  isRoomOwner: false,
}

const argv = process.argv.slice(2)
const { h: host, p: port, n: _name } = mri(argv)

export const StoreContext = createContext<Context>(defaults)

export default function StoreProvider(props: PropsWithChildren) {
  const router = useRouter()
  const [name, setName] = useState(_name)
  const [client, setClient] = useState<Socket | undefined>(undefined)
  const [isConnected, setIsConnected] = useState(false)
  const [room, setRoom] = useState<any>({})
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const isRoomOwner = useMemo(() => { return name === room?.game?.players?.[0].name }, [room])

  useEffect(() => {
    if (!name)
      return
    setClient(ioc(`http://${host}:${port}`, { query: { name } }))
  }, [name])

  useEffect(() => {
    if (!client)
      return

    client.on('connect', () => {
      setIsConnected(true)
    })

    client.on('room:get', ({ data }: any) => {
      setRoom(data)
    })

    client.on('message:get', ({ data }: any) => {
      setMessages(prev => [...prev, data])
    })

    client.on('game:start', () => {
      router.push('/game')
    })
  }, [client])

  function clearChat() {
    setMessages([])
  }

  const value = useMemo(() => ({
    name,
    input,
    room,
    messages,
    client,
    isConnected,
    isRoomOwner,
    setName,
    setInput,
    clearChat,
  }), [name, room, messages, input, isConnected])

  return (
    <StoreContext.Provider value={{ ...value }}>
      {props.children}
    </StoreContext.Provider>
  )
}
