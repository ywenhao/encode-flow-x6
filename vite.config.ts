import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    minify: false,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        assetFileNames: (chunkInfo) => {
          let extType = chunkInfo.name?.split('.')[1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType ?? ''))
            extType = 'img'

          if (extType === 'css')
            return '[name][extname]'

          return `assets/${extType}/[name][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/encode-flow-x6.min.js',
      },
    },
  },
})
