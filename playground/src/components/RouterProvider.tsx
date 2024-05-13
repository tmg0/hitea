import type { PropsWithChildren } from 'react'
import React, { createContext, useMemo } from 'react'
import type { Route } from '../hooks/useRouter'

interface Props {
  path: string
  routes: Route[]
  setPath?: (value: string) => void
}

const defaults = {
  path: '/sign-in',
  routes: [],
}

export const RouterContext = createContext<Props>(defaults)

export default function RouterProvider(props: PropsWithChildren<Props>) {
  const value = useMemo(() => ({
    path: props.path,
    routes: props.routes,
    setPath: props.setPath,
  }), [props.path, props.routes])

  return (
    <RouterContext.Provider value={value}>
      {props.children}
    </RouterContext.Provider>
  )
}
