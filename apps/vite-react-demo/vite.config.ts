/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import commonjs from '@rollup/plugin-commonjs';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/vite-react-demo',

  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [commonjs(), nodePolyfills(), react(), nxViteTsPaths()],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  define: {
    'process.env': {},
  },
  base: './',
  build: {
    outDir: '../../dist/apps/vite-react-demo',
    emptyOutDir: true,
    reportCompressedSize: true,
    rollupOptions: {
      external: [
        // 'react',
        // 'react-dom',
        // '@futureverse/signer',
        // '@futureverse/transact',
        // '@futureverse/auth',
        // '@futureverse/auth-react',
        '@futureverse/wagmi-connectors',
        // '@walletconnect/utils',
      ],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
