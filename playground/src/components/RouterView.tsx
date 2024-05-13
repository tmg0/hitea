import { useContext } from 'react'
import { RouterContext } from './RouterProvider'

export default function RouterView() {
  const ctx = useContext(RouterContext)
  const Component = ctx.routes.find(({ path }) => path === ctx.path)?.component?.()

  return Component
}
