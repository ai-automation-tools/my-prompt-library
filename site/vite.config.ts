import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

// Nothing in src/ reads GEMINI_API_KEY, and the @google/genai dependency it was
// added for is gone. The old `define` inlined the key into the client bundle,
// so it was a leak waiting for someone to set the variable.
export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          // React and motion are ~475 kB of the entry chunk and change only
          // when we bump them, so keeping them out of the app chunk means a
          // content edit no longer invalidates them in anyone's cache. It also
          // puts every chunk under Vite's 500 kB warning threshold.
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (/[\/]node_modules[\/](react|react-dom|scheduler)[\/]/.test(id)) return 'react-vendor';
            if (/[\/]node_modules[\/](motion|motion-dom|motion-utils|framer-motion)[\/]/.test(id)) return 'motion';
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3010,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
