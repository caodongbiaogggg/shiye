import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';
import { generatePosts } from './scripts/posts.mjs';
generatePosts();
export default defineConfig({ css: { postcss: { plugins: [tailwindcss()] } }, plugins: [{
  name: 'markdown-posts',
  configureServer(server) {
    server.watcher.add('content/posts');
    const update = (file: string) => {
      if (!file.replaceAll('\\', '/').includes('content/posts/') || !file.endsWith('.md')) return;
      try { generatePosts(); } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        server.config.logger.error(message);
        server.ws.send({ type: 'error', err: { message, stack: '' } });
      }
    };
    server.watcher.on('add', update).on('change', update).on('unlink', update);
  },
}, vinext()] });
