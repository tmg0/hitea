import React, { useState } from 'react'
import RouterProvider from './components/RouterProvider'
import RouterView from './components/RouterView'
import { routes } from './router'

export default function App() {
  const [route] = useState('/sign-in')

  return (
    <RouterProvider route={route} routes={routes}>
      <RouterView />
    </RouterProvider>
  )
}
