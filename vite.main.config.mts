import { builtinModules } from 'node:module';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rolldownOptions: {
      external: [
        'better-sqlite3',
        /^electron(?:\/.*)?$/,
        /^node:/,
        ...builtinModules,
      ],
    },
  },
});
