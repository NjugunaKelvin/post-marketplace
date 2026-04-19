import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: '../server/public',
    rollupOptions: {
      input: {
        main: './src/main.ts',
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
    emptyOutDir: true,
  },
});
