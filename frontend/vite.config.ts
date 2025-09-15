import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0', // Important pour Docker
    port: 3000,
    watch: {
      usePolling: true // Pour le hot reload dans Docker
    }
  }
})