import React, { useContext, useEffect, useState } from 'react'
import { Box, Text } from 'ink'
import { Alert, Select, TextInput } from '@inkjs/ui'
import type { Socket } from 'socket.io-client'
import ioc from 'socket.io-client'
import useRouter from '../hooks/useRouter'
import { StoreContext } from './StoreProvider'

function connected(client: Socket): Promise<void> {
  return new Promise((resolve) => {
    client.on('connect', () => {
      resolve()
    })
  })
}

function NameInput() {
  const ctx = useContext(StoreContext)

  async function handleSubmit(name: string) {
    const client = ioc(`http://${ctx.host}:${ctx.port}`, { query: { name } })
    ctx.setClient?.(client)
    ctx.setName?.(name)
    await connected(client!)
    ctx.setIsConnected?.(true)
  }

  return (
    <Box flexDirection="row" gap={1}>
      <Text>Name: </Text>
      <TextInput
        placeholder="Enter your name..."
        onSubmit={name => handleSubmit(name)}
      />
    </Box>
  )
}

interface RoomNameInputProps {
  onSubmit: (value: string) => void
}

function RoomNameInput(props: RoomNameInputProps) {
  const ctx = useContext(StoreContext)

  function handleSubmit(name: string) {
    ctx.client?.emit('room:create', { name })
    ctx.client?.on('room:get', ({ data }: any) => {
      props.onSubmit(data.id)
    })
  }

  return (
    <Box flexDirection="row" gap={1}>
      <Text>Name: </Text>
      <TextInput
        placeholder="Enter the room name..."
        onSubmit={handleSubmit}
      />
    </Box>
  )
}

interface RoomSelectorProps {
  onSelect: (id: string) => void
  setIsNew: (value: boolean) => void
}

function RoomSelector(props: RoomSelectorProps) {
  const ctx = useContext(StoreContext)
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    ctx.client?.on('room:list', ({ data }: any) => {
      setRooms(data ?? [])
    })
    ctx.client?.emit('room:list')
  }, [])

  function handleChange(id: string) {
    props.setIsNew(id === 'new')
    props.onSelect(id === 'new' ? '' : id)
  }

  return (
    <>
      <Select
        options={[
				  {
            label: 'New',
            value: 'new',
          },
          ...rooms.map(({ id: value, name: label }) => ({
            value,
            label,
          })),
        ]}
        onChange={handleChange}
      />
    </>
  )
}

export default function SignIn() {
  const ctx = useContext(StoreContext)
  const [roomId, setRoomId] = useState('')
  const [isNew, setIsNew] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (roomId)
      router.push({ path: '/room' })
  }, [roomId])

  return (
    <Box flexDirection="column" gap={1}>
      {!ctx.name ? <NameInput /> : undefined}
      {ctx.name ? <Alert variant="info">{ctx.name}</Alert> : undefined}
      {ctx.isConnected && ctx.name && !isNew ? <RoomSelector onSelect={setRoomId} setIsNew={setIsNew} /> : undefined}
      {ctx.isConnected && isNew ? <RoomNameInput onSubmit={setRoomId} /> : undefined}
    </Box>
  )
}
