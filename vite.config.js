import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'VideoPlugin',
      formats: ['es', 'umd'],
      fileName: (format) => `video-plugin.${format === 'umd' ? 'umd.js' : 'js'}`
    },
    rollupOptions: {
      external: ['@hannal/editorjs'],
      output: {
        globals: {
          '@hannal/editorjs': 'EditorJS'
        }
      }
    }
  }
}); 