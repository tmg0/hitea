import { useContext, useEffect } from 'react'
import { RouterContext } from '../components/RouterProvider'

const isString = (value: any): value is string => typeof value === 'string'

export interface Route {
  name?: string
  path: string
  query?: Record<string, any>
  component?: () => React.JSX.Element
}

export default function useRouter() {
  const ctx = useContext(RouterContext)

  function push(route: string | Omit<Route, 'component'>) {
    ctx.setPath?.(isString(route) ? route : route.path!)
  }

  return {
    push,
  }
}
