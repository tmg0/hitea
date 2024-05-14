import React from 'react'
import RouterProvider from './components/RouterProvider'
import RouterView from './components/RouterView'
import { routes } from './router'

export default function App() {
  return (
    <RouterProvider routes={routes}>
      <RouterView />
    </RouterProvider>
  )
}
