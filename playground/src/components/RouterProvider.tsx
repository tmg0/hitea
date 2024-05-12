import type { PropsWithChildren } from 'react'
import React, { createContext } from 'react'
import type { Route } from '../hooks/useRouter'

interface Props {
  route: string
  routes: Route[]
}

const defaults = {
  route: '/sign-in',
  routes: [],
}

export const RouterContext = createContext<Props>(defaults)

export default function RouterProvider({ children, route, routes }: PropsWithChildren<Props>) {
  return (
    <RouterContext.Provider value={{ route, routes }}>
      {children}
    </RouterContext.Provider>
  )
}
