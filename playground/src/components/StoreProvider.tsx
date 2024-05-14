import process from 'node:process'
import type { PropsWithChildren } from 'react'
import React, { createContext, useEffect, useMemo, useState } from 'react'
import type { Socket } from 'socket.io-client'
import ioc from 'socket.io-client'
import mri from 'mri'

interface Context {
  name: string
  client?: Socket
  isConnected: boolean
  setName?: (value: string) => void
}

const defaults = {
  name: '',
  client: undefined,
  isConnected: false,
}

const argv = process.argv.slice(2)
const { h: host, p: port, n: _name } = mri(argv)

export const StoreContext = createContext<Context>(defaults)

export default function StoreProvider(props: PropsWithChildren) {
  const [name, setName] = useState(_name)
  const [client, setClient] = useState<Socket | undefined>(undefined)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!name)
      return
    setClient(ioc(`http://${host}:${port}`, { query: { name } }))
  }, [name])

  useEffect(() => {
    client?.on('connect', () => {
      setIsConnected(true)
    })
  }, [client])

  const value = useMemo(() => ({
    name,
    client,
    isConnected,
    setName,
  }), [name, isConnected])

  return (
    <StoreContext.Provider value={{ ...value }}>
      {props.children}
    </StoreContext.Provider>
  )
}
