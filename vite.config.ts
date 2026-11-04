import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { readFileSync } from 'node:fs'

import { cloudflare } from "@cloudflare/vite-plugin";

export const OFFLINE_FILE = 'sakskydd-offline.html'

// Rename the single-file output so it sits next to the normal site in dist/client
const renameOffline = (): Plugin => ({
  name: 'rename-offline-html',
  enforce: 'post',
  // Embed the favicon so the file makes no lookups outside itself
  transformIndexHtml(html) {
    const svg = readFileSync('public/favicon.svg', 'utf8')
    return html.replace('href="/favicon.svg"', `href="data:image/svg+xml,${encodeURIComponent(svg)}"`)
  },
  generateBundle(_, bundle) {
    const html = bundle['index.html']
    if (html) {
      html.fileName = OFFLINE_FILE
      delete bundle['index.html']
      bundle[OFFLINE_FILE] = html
    }
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) =>
  mode === 'offline'
    ? {
        // One self-contained HTML file (JS, CSS and fonts inlined) that works from file://
        plugins: [react(), viteSingleFile(), renameOffline()],
        publicDir: false,
        build: { outDir: 'dist/client', emptyOutDir: false },
      }
    : {
        plugins: [react(), cloudflare()],
      }
)
