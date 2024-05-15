import React, { useContext, useState } from 'react'
import { Box, Text } from 'ink'
import { Select, TextInput } from '@inkjs/ui'
import useRouter from '../hooks/useRouter'
import { StoreContext } from '../components/StoreProvider'

function RoomActionSelector() {
  const actions = ['Start', 'Exit']
  const router = useRouter()
  const ctx = useContext(StoreContext)

  function onChange(value: string) {
    if (value === 'Start')
      onStart()
    if (value === 'Exit')
      onExit()
  }

  function onStart() {
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
