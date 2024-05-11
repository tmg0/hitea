import React, { useState } from 'react'
import { Box } from 'ink'
import { TextInput } from '@inkjs/ui'

export default function App() {
  const [_, setValue] = useState('')

  return (
    <Box flexDirection="column" gap={1}>
      <TextInput
        placeholder="Enter your name..."
        onChange={setValue}
      />
    </Box>
  )
}
