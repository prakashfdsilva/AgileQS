import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        storyboard: resolve(__dirname, 'storyboard.html'),
        services: resolve(__dirname, 'services.html'),
      },
    },
  },
})
