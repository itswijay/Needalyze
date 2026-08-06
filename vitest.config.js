import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
  },
  test: {
    // The suite covers the pure layers only — validation schemas and domain
    // services. Nothing here renders a component or touches the network, so a
    // Node environment is enough and the tests stay fast.
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
})
