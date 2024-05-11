import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/index.tsx'],
  format: ['esm'],
  target: 'node18',
  splitting: true,
  clean: true,
})
