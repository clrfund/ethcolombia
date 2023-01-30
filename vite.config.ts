import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import inject from '@rollup/plugin-inject'
import nodeStdlibBrowser from 'node-stdlib-browser'

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      ...nodeStdlibBrowser,
    },
  },
  build: {
    target: 'esnext', // to enable Big integer literals
    commonjsOptions: {
      transformMixedEsModules: true, // to enable @walletconnect/web3-provider which has some code in CommonJS
    },
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      plugins: [
        inject({
          global: [
            require.resolve('node-stdlib-browser/helpers/esbuild/shim'),
            'global',
          ],
          process: [
            require.resolve('node-stdlib-browser/helpers/esbuild/shim'),
            'process',
          ],
          Buffer: [
            require.resolve('node-stdlib-browser/helpers/esbuild/shim'),
            'Buffer',
          ],
        }),
      ],
    },
  },
})
