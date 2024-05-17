import React, { useContext, useEffect, useState } from 'react'
import { Box, Text } from 'ink'
import TextInput from 'ink-text-input'
import { Select } from '@inkjs/ui'
import useRouter from '../hooks/useRouter'
import { StoreContext } from '../components/StoreProvider'

function NameInput() {
  const [value, setValue] = useState('')
  const ctx = useContext(StoreContext)

  return (
    <Box flexDirection="row" gap={1}>
      <Text>Name: </Text>
      <TextInput
        value={value}
        placeholder="Enter your name..."
        onChange={setValue}
        onSubmit={ctx.setName!}
      />
    </Box>
  )
}

interface RoomInputProps {
  onSubmit: (value: string) => void
}

function RoomInput(props: RoomInputProps) {
  const [value, setValue] = useState('')
  const ctx = useContext(StoreContext)

  function onSubmit(name: string) {
    ctx.client?.emit('room:create', { name })
    ctx.client?.on('room:get', ({ data }: any) => {
      props.onSubmit(data.id)
    })
  }

  return (
    <Box flexDirection="row" gap={1}>
      <Text>Room: </Text>
      <TextInput
        value={value}
        placeholder="Enter the room..."
        onChange={setValue}
        onSubmit={onSubmit}
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

  function onChange(id: string) {
    props.setIsNew(id === 'new')
    ctx.client?.emit('game:join', { roomId: id })
    ctx.client?.on('room:get', () => {
      props.onSelect(id === 'new' ? '' : id)
    })
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
        onChange={onChange}
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
      router.push('/room')
  }, [roomId])

  return (
    <Box flexDirection="column" gap={1}>
      {!ctx.name ? <NameInput /> : undefined}
      {ctx.isConnected && ctx.name && !isNew ? <RoomSelector onSelect={setRoomId} setIsNew={setIsNew} /> : undefined}
      {ctx.isConnected && isNew ? <RoomInput onSubmit={setRoomId} /> : undefined}
    </Box>
  )
}
