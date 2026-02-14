import { defineConfig, type ConfigEnv, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  const rootDir = path.resolve(__dirname, "../../");
  const env = loadEnv(mode, rootDir, "");

  return {
    server: {
      host: true,
      port: 5173,
      allowedHosts: [
        ".vercel.app",
        ".onrender.com",
        "gene-forge-analyzer.vercel.app",
        "gene-forge-analyzer.onrender.com"
      ],
      // Use proxy ONLY in development
      proxy: mode === 'development' ? {
        '/api': {
          target: env.VITE_PROXY_TARGET || 'http://127.0.0.1:5000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy) => {
            proxy.on('error', (err) => {
              if (err.message.includes('ECONNREFUSED') || err.message.includes('ECONNRESET')) {
                return; // suppress noisy connection errors during backend boot
              }
              console.error('Proxy Error:', err.message);
            });
          },
        },
        '/socket.io': {
          target: env.VITE_PROXY_TARGET || 'http://127.0.0.1:5000',
          ws: true,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('error', (err) => {
              if (err.message.includes('ECONNREFUSED') || err.message.includes('ECONNRESET')) {
                return;
              }
              console.error('WS Proxy Error:', err.message);
            });
          },
        }
      } : undefined
    },
    preview: {
      allowedHosts: [".vercel.app", ".onrender.com"],
    },
    plugins: [
      react(),
    ].filter(Boolean),
    envDir: '../../',
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      sourcemap: mode === 'development',
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'charts-vendor': ['recharts'],
            'pdf-vendor': ['jspdf', 'html2canvas'],
          }
        }
      }
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || '/api'),
      'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(env.VITE_GOOGLE_CLIENT_ID || ''),
      'import.meta.env.VITE_APP_NAME': JSON.stringify(env.VITE_APP_NAME || 'Gene Forge Analyzer'),
    }
  };
});
