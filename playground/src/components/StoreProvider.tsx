import type { PropsWithChildren } from 'react'
import React, { createContext, useState } from 'react'
import type { Socket } from 'socket.io-client'

interface Props {
  host: string
  port: string | number
  isConnected: boolean
  name?: string
  client?: Socket
  setName?: (value: string) => void
  setIsConnected?: (value: boolean) => void
  setClient?: (value: Socket) => void
}

const defaults = {
  host: '127.0.0.1',
  port: 5176,
  isConnected: false,
}

export const StoreContext = createContext<Props>(defaults)

export default function StoreProvider(props: PropsWithChildren<Omit<Props, 'isConnected'>>) {
  const [name, setName] = useState(props.name)
  const [client, setClient] = useState<Socket | undefined>(undefined)
  const [isConnected, setIsConnected] = useState(false)

  return (
    <StoreContext.Provider value={{ ...props, name, client, isConnected, setName, setIsConnected, setClient }}>
      {props.children}
    </StoreContext.Provider>
  )
}
