import React, { useContext, useMemo } from 'react'
import { Box, Text } from 'ink'
import { UnorderedList } from '@inkjs/ui'
import { StoreContext } from '../StoreProvider'

export default function RoomBanner() {
  const ctx = useContext(StoreContext)
  const players = useMemo(() => ctx.room.game?.players, [ctx.room.game])
  const owner = useMemo(() => players?.[0].name, [players])

  return (
    <>
      <Box flexDirection="row" gap={1}>
        <Text bold>{ctx.room.name}</Text>
        <Text color="gray">{`(${owner})`}</Text>
      </Box>

      <UnorderedList>
        {
          players.map((player: any) => {
            return (
              <UnorderedList.Item key={player.id}>
                <Box flexDirection="row" gap={1}>
                  <Text>{player.name}</Text>
                  <Text color="gray">{`(chips: ${player.chips})`}</Text>
                </Box>
              </UnorderedList.Item>
            )
          })
        }
      </UnorderedList>
    </>
  )
}
