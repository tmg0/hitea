import { useContext } from 'react'
import { RouterContext } from '../components/RouterProvider'

export interface Route {
  name?: string
  path: string
  query?: Record<string, any>
  component?: () => React.JSX.Element
}

export default function useRouter() {
  const ctx = useContext(RouterContext)

  function push(route: Omit<Route, 'component'>) {
    ctx.setPath?.(route.path!)
  }

  return {
    push,
  }
}
