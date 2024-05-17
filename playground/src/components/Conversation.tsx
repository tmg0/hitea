import React, { useContext } from 'react'
import { Box, Text } from 'ink'
import { StoreContext } from './StoreProvider'

export function Conversation() {
  const ctx = useContext(StoreContext)

  return (
    <Box flexDirection="column">
      {ctx.messages.map(({ from, content }, i) => <Text key={i}>{`${from}: ${content}`}</Text>)}
    </Box>
  )
}
