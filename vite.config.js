import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Recharts makes the bundle a bit larger than Vite's default warning size.
    chunkSizeWarningLimit: 700,
  },
});
