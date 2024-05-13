import React, { useState } from 'react'
import RouterProvider from './components/RouterProvider'
import RouterView from './components/RouterView'
import { routes } from './router'

export default function App() {
  const [path, setPath] = useState('/sign-in')

  return (
    <RouterProvider path={path} routes={routes} setPath={setPath}>
      <RouterView />
    </RouterProvider>
  )
}
