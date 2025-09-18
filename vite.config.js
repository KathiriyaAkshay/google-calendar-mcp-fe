import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,   // enable polling
    },
    host: true,           // listen on all hosts
    strictPort: true,     // keep same port
  },
})
