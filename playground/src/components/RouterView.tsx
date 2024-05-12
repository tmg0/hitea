import { useContext } from 'react'
import { RouterContext } from './RouterProvider'

export default function RouterView() {
  const { route, routes } = useContext(RouterContext)
  const Component = routes.find(({ path }) => path === route)?.component?.()
  return Component
}
