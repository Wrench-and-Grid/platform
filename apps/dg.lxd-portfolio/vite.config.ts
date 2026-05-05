import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import type { IncomingMessage, ServerResponse } from 'http'

const ALLOWED_ARTICLE_URLS = new Set([
  'https://vivirenelpoblado.com/espacio-7-para-lo-cultural-y-social/',
  'https://vivirenelpoblado.com/cancha-renovada-con-talento-en-garabato/',
])

// Mirrors api/proxy.ts so `/api/proxy` works during `vite dev`
function devArticleProxy() {
  return {
    name: 'dev-article-proxy',
    configureServer(server: { middlewares: { use: (fn: (req: IncomingMessage, res: ServerResponse, next: () => void) => void) => void } }) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const parsed = new URL(req.url ?? '/', 'http://localhost')
        if (parsed.pathname !== '/api/proxy') { next(); return }

        const url = parsed.searchParams.get('url') ?? ''
        if (!ALLOWED_ARTICLE_URLS.has(url)) {
          res.writeHead(403, { 'Content-Type': 'text/plain' })
          res.end('Forbidden')
          return
        }

        try {
          const upstream = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; dev-proxy/1.0)',
              Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
          })
          const html = await upstream.text()
          const origin = new URL(url).origin
          const withBase = html.replace(/<head[^>]*>/i, m => `${m}<base href="${origin}/">`)
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
          res.end(withBase)
        } catch {
          res.writeHead(502, { 'Content-Type': 'text/plain' })
          res.end('Failed to fetch article')
        }
      })
    },
  }
}

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [react(), devArticleProxy()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router'
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion'
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
