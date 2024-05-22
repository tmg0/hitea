import React from 'react'
import StoreProvider from './components/StoreProvider'
import RouterProvider from './components/RouterProvider'
import RouterView from './components/RouterView'
import { routes } from './router'

export default function App() {
  return (
    <RouterProvider routes={routes}>
      <StoreProvider>
        <RouterView />
      </StoreProvider>
    </RouterProvider>
  )
}
