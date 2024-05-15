import React, { useContext } from 'react'
import { Box, Text, useInput } from 'ink'
import { Select, TextInput } from '@inkjs/ui'
import useRouter from '../hooks/useRouter'
import { StoreContext } from '../components/StoreProvider'

function RoomActionSelector() {
  const actions = ['Start', 'Exit']
  const router = useRouter()
  const ctx = useContext(StoreContext)

  useInput((_, key) => {
    if (key.return)
      console.log(ctx.room)
  })

  function onChange(value: string) {
    if (value === 'Start')
      onStart()
    if (value === 'Exit')
      onExit()
  }

  function onStart() {
    const players = ctx.room.players ?? []
    if (players < 2)
      return
    router.push('/game')
  }

  function onExit() {
    ctx.client?.emit('room:leave')
    router.push('/sign-in')
  }

  return (
    <Select
      options={actions.map(a => ({ value: a, label: a }))}
      onChange={onChange}
    />
  )
}

function ChatInput() {
  const ctx = useContext(StoreContext)

  return (
    <Box flexDirection="row" gap={1}>
      <Text>{`${ctx.name}:`}</Text>
      <TextInput />
    </Box>
  )
}

export default function Room() {
  return (
    <Box flexDirection="column" gap={1}>
      <RoomActionSelector />
      <ChatInput />
    </Box>
  )
}
