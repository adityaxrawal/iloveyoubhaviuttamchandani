import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import layoutSave from './vite-plugin-layout-save'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), layoutSave()],
  css: {
    modules:
      command === 'serve'
        ? {
            // Dev only: `File__local__hash` lets the drag editor read a class
            // name off the DOM and know which .module.css rule to rewrite.
            // Production keeps Vite's default (opaque, shorter) names.
            generateScopedName: (name: string, filename: string) => {
              const cleanPath = filename.split('?')[0];
              const base = path.basename(cleanPath).replace(/\.module\.css$/, '');
              let h = 5381
              for (let i = 0; i < filename.length; i++)
                h = ((h << 5) + h + filename.charCodeAt(i)) | 0
              return `${base}__${name}__${(h >>> 0).toString(36).slice(0, 4)}`
            },
          }
        : undefined,
  },
}))
