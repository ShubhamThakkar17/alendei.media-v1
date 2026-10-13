import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const INCLUDE = /<!--\s*include:([\w./-]+)\s*-->/g;

// Inlines shared HTML partials: <!-- include:partials/nav.html -->
function htmlIncludes() {
  return {
    name: 'html-includes',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replace(INCLUDE, (_, file) => readFileSync(resolve(root, file), 'utf8')),
    },
    handleHotUpdate({ file, server }) {
      if (file.includes('/partials/')) server.ws.send({ type: 'full-reload' });
    },
  };
}

export default defineConfig({
  plugins: [htmlIncludes()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        careers: resolve(root, 'careers.html'),
      },
    },
  },
});
