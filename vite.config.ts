import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: './',
  esbuild: { jsx: 'automatic' },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      },
    },
  },
  test: { include: ['src/**/*.test.ts'] },
});
