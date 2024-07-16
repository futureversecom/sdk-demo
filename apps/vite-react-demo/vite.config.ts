/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

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

  plugins: [react(), nxViteTsPaths()],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  define: {
    'process.env': {},
  },
  build: {
    outDir: '../../dist/apps/vite-react-demo',
    emptyOutDir: true,
    reportCompressedSize: true,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@futureverse/signer',
        '@futureverse/auth',
        '@futureverse/auth-react',
      ],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
