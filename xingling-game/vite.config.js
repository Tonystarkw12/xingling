import { defineConfig } from 'vite';

export default defineConfig({
  base: '',
  server: {
    host: '0.0.0.0',
    port: 5174,
    hmr: false,
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/*.tsbuildinfo',
        '**/__pycache__/**',
        '**/.cache/**',
        '**/.vscode/**',
        '**/.cursor/**',
        '**/.claude/**',
        '**/.codex/**',
        '**/.codegraph/**',
        '**/.repowise/**',
        '**/.serena/**',
        '**/.zread/**',
      ],
    },
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
