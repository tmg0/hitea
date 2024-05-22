import React, { useContext, useEffect } from 'react'
import { Select } from '@inkjs/ui'
import { StoreContext } from '../StoreProvider'

interface RoomSelectorProps {
  onSelect: (id: string) => void
  setIsNew: (value: boolean) => void
}

export default function RoomSelector(props: RoomSelectorProps) {
  const ctx = useContext(StoreContext)

  useEffect(() => {
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
    <Select
      options={[
        {
          label: 'New',
          value: 'new',
        },
        ...ctx.rooms.map(({ id: value, name: label }) => ({
          value,
          label,
        })),
      ]}
      onChange={onChange}
    />
  )
}
