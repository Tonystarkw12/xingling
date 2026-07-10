import { defineConfig } from 'vite';

export default defineConfig({
  base: '',
  server: {
    host: '0.0.0.0',
    port: 5174,
    hmr: false,
  },
  plugins: [],
  css: {
    postcss: './postcss.config.js',
  },
  resolve: {
    alias: {
      phaser: 'phaser/dist/phaser.js',
    },
  },
});
