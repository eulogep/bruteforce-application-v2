import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Optimisations de build
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Désactivé en prod pour les performances
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Supprimer les console.log en prod
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparation des vendors pour un meilleur caching
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog'],
          utils: ['clsx', 'tailwind-merge']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },

  // Configuration serveur optimisée
  server: {
    port: 6000,
    host: true, // Permet l'accès depuis d'autres machines
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        timeout: 30000
      }
    },
    // Optimisations HMR
    hmr: {
      overlay: true
    }
  },

  // Optimisations CSS
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },

  // Configuration des dépendances
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog'
    ],
    exclude: ['@vite/client', '@vite/env']
  },

  // Variables d'environnement
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __VERSION__: JSON.stringify(process.env.npm_package_version || '2.0.0')
  },

  // Configuration de prévisualisation
  preview: {
    port: 4173,
    host: true
  }
})
