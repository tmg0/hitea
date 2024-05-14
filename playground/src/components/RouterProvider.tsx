import type { PropsWithChildren } from 'react'
import React, { createContext, useEffect, useMemo, useState } from 'react'
import type { Route } from '../hooks/useRouter'

interface Context {
  path: string
  routes: Route[]
  setPath?: (value: string) => void
}

const defaults = {
  path: '/sign-in',
  routes: [],
}

export const RouterContext = createContext<Context>(defaults)

export default function RouterProvider(props: PropsWithChildren<Pick<Context, 'routes'>>) {
  const [path, setPath] = useState('/sign-in')

  const value = useMemo(() => ({
    path,
    routes: props.routes,
    setPath,
  }), [path, props.routes])

  return (
    <RouterContext.Provider value={value}>
      {props.children}
    </RouterContext.Provider>
  )
}
