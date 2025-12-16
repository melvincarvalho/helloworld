import { defineConfig } from 'vite'

export default defineConfig({
  base: '/helloworld/',
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true
  }
})
