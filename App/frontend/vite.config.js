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
      include: 'src/**/*.{js,jsx,ts,tsx}',
      exclude: [
        'node_modules',
        'cypress',
        'tests',
        'coverage',
        'dist',
        '**/*.test.js',
        '**/*.test.jsx',
        '**/*.spec.js',
        '**/*.spec.jsx',
        '**/__test__/**',
        '**/__tests__/**',
        'src/**/*.test.js',
        'src/**/*.test.jsx',
        'src/**/__test__/**',
        'src/**/__tests__/**'
      ],
      extension: ['.js', '.jsx', '.ts', '.tsx'],
      cypress: true,
      requireEnv: false
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    
  },
})
