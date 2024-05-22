import React, { useContext, useMemo } from 'react'
import { Box, Text } from 'ink'
import TextInput from 'ink-text-input'
import { Select } from '@inkjs/ui'
import useRouter from '../hooks/useRouter'
import { StoreContext } from '../components/StoreProvider'
import { Conversation } from '../components/Conversation'
import RoomBanner from '../components/Room/RoomBanner'
import Divider from '../components/Divider'

function RoomActionSelector() {
  const router = useRouter()
  const ctx = useContext(StoreContext)

  const isDisabled = useMemo(() => {
    return !!ctx.input
  }, [ctx.input])

  const actions = useMemo(() => {
    if (ctx.isRoomOwner)
      return ['Start', 'Exit']
    return ['Exit']
  }, [ctx.isRoomOwner])

  const options = useMemo(() => {
    return actions.map(a => ({ value: a, label: a }))
  }, [actions])

  function onChange(value: string) {
    if (value === 'Start')
      onStart()
    if (value === 'Exit')
      onExit()
  }

  function onStart() {
    const players = ctx.room.game.players ?? []
    if (players.length < 2)
      return
    ctx.client?.emit('game:start')
  }

  function onExit() {
    ctx.client?.emit('room:exit')
    router.push('/sign-in')
  }

  return (
    <Select
      isDisabled={isDisabled}
      options={options}
      onChange={onChange}
    />
  )
}

function ChatInput() {
  const ctx = useContext(StoreContext)

  function onSubmit(value: string) {
    if (!value)
      return
    ctx.client?.emit('message:send', ctx.input)
    ctx.setInput?.('')
  }

  return (
    <Box flexDirection="row" gap={1}>
      <Text>{`${ctx.name}:`}</Text>
      <TextInput value={ctx.input} onChange={ctx.setInput!} onSubmit={onSubmit} />
    </Box>
  )
}

export default function Room() {
  const ctx = useContext(StoreContext)

  return (
    <Box flexDirection="column" gap={1}>
      <RoomBanner />
      <Divider />
      {ctx.messages.length ? <Conversation /> : undefined}
      <RoomActionSelector />
      <ChatInput />
    </Box>
  )
}
