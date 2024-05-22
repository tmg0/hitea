import React from 'react'
import { Box, Text } from 'ink'

export default function Divider() {
  const char = '-'

  return (
    <Box flexDirection="row">
      <Text>{char.repeat(50)}</Text>
    </Box>
  )
}
