import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5178,
    host: '0.0.0.0',
    allowedHosts: ['xingling.201014.xyz'],
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
})
