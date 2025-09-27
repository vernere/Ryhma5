import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import istanbul from 'vite-plugin-istanbul';
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    istanbul({
      include: ['src/**/*'],
      exclude: ['node_modules', 'cypress', 'tests/'],
      extension: ['.js', '.jsx', '.ts', '.tsx'],
      cypress: true,
      requireEnv: false,
      onTransform(source, id) {
        if (id.includes('src/')) {
          console.log('[istanbul] Instrumenting for coverage:', id);
        }
        return source;
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    
  },
})
