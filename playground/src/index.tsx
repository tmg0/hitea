import { render } from 'ink'
import React from 'react'
import App from './App'
import StoreProvider from './components/StoreProvider'

async function main() {
  render(
    <StoreProvider>
      <App />
    </StoreProvider>,
  )
}

main()
