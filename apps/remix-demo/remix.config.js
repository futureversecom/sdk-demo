import { createWatchPaths } from '@nx/remix';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
export default {
  ignoredRouteFiles: ['**/.*'],
  appDirectory: 'app',
  browserBuildDirectory: 'public/build',
  publicPath: '/build/',
  serverBuildDirectory: 'build',
  serverModuleFormat: 'esm',
  devServerPort: 4100,
  watchPaths: () => createWatchPaths(__dirname),
  browserNodeBuiltinsPolyfill: {
    modules: {
      buffer: true,
      events: true,
    },
  },
};
