import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { Scanner } from '@tailwindcss/oxide'

// Tailwind v4 normally discovers utility classes by scanning the project with
// @tailwindcss/oxide. On hosts where the Oxide native binary cannot run (for
// example, an Application Control policy blocking the unsigned .node file),
// Tailwind silently falls back to its WASI scanner, which cannot read the
// Windows filesystem and therefore finds no classes. The result is a stylesheet
// containing only preflight and the custom utilities — the app looks unstyled.
//
// This plugin performs the same extraction with Oxide's content-based
// `scanFiles` API (which does not need filesystem access) and feeds the
// candidates to Tailwind through the `@source inline(...)` directive. It is a
// no-op when the native scanner works, so normal projects are unaffected.
function tailwindSourceFallback() {
  let root = ''
  let needsFallback = false

  const collectCandidateFiles = () => {
    const files = []

    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) continue

        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          walk(fullPath)
        } else if (/\.(jsx?|tsx?|html)$/.test(entry.name)) {
          files.push(fullPath)
        }
      }
    }

    const srcDir = path.join(root, 'src')
    if (fs.existsSync(srcDir)) walk(srcDir)

    const indexPath = path.join(root, 'index.html')
    if (fs.existsSync(indexPath)) files.push(indexPath)

    return files
  }

  return {
    name: 'tailwind-source-fallback',
    enforce: 'pre',

    configResolved(config) {
      root = config.root

      // If the native scanner can read the project, Tailwind already generates
      // the right CSS and this plugin does nothing.
      const scanner = new Scanner({
        sources: [{ base: root, pattern: '**/*', negated: false }],
      })
      scanner.scan()
      needsFallback = scanner.files.length === 0
    },

    transform(code, id) {
      if (!needsFallback) return

      const cleanId = id.split('?')[0].replace(/\\/g, '/')
      if (!cleanId.endsWith('/src/index.css')) return

      const files = collectCandidateFiles()
      const scanner = new Scanner({ sources: [] })
      const candidates = new Set()

      for (const file of files) {
        const contents = fs.readFileSync(file, 'utf8')
        const extension = path.extname(file).slice(1)
        for (const candidate of scanner.scanFiles([{ content: contents, extension }])) {
          // `@source inline()` separates candidates by whitespace and uses
          // double quotes; skip the rare token that cannot be represented.
          if (candidate && !/[\s"\\]/.test(candidate)) candidates.add(candidate)
        }
      }

      // Keep Vite watching the scanned files so the stylesheet is regenerated
      // when a class is added or removed during development.
      for (const file of files) this.addWatchFile(file)

      return {
        code: `${code}\n@source inline("${[...candidates].join(' ')}");\n`,
        map: null,
      }
    },

    handleHotUpdate({ file, modules, server }) {
      if (!needsFallback) return

      const normalized = file.replace(/\\/g, '/')
      if (normalized.endsWith('/src/index.css')) return
      if (!normalized.includes('/src/') && !normalized.endsWith('/index.html')) return

      const cssModules = [...server.moduleGraph.idToModuleMap.values()].filter(
        (module) => module.id && module.id.replace(/\\/g, '/').endsWith('/src/index.css'),
      )
      if (cssModules.length === 0) return

      for (const cssModule of cssModules) server.moduleGraph.invalidateModule(cssModule)

      // Tailwind's Vite plugin caches its compiler per CSS module and only
      // rebuilds when a build dependency changes. Touch the entry stylesheet so
      // the newly extracted candidate list is picked up during development.
      try {
        const now = new Date()
        fs.utimesSync(path.join(root, 'src/index.css'), now, now)
      } catch {
        // If the stylesheet cannot be touched, the styles still work; only the
        // live update for a newly added class is skipped.
      }

      return [...new Set([...modules, ...cssModules])]
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindSourceFallback(),
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
