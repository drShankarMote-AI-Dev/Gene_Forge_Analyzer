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
  console.log("VITE CONFIG DEBUG: mode =", mode);
  console.log("VITE CONFIG DEBUG: rootDir =", rootDir);
  console.log("VITE CONFIG DEBUG: VITE_GOOGLE_CLIENT_ID exists =", !!env.VITE_GOOGLE_CLIENT_ID);
  if (env.VITE_GOOGLE_CLIENT_ID) {
    console.log("VITE CONFIG DEBUG: VITE_GOOGLE_CLIENT_ID prefix =", env.VITE_GOOGLE_CLIENT_ID.substring(0, 10));
  }

  return {
    server: {
      host: "::",
      port: 8080,
      allowedHosts: [".vercel.app", "gene-forge-analyzer.vercel.app"],
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:5000',
          changeOrigin: true,
          secure: false,
        },
        '/socket.io': {
          target: 'http://127.0.0.1:5000',
          ws: true,
          changeOrigin: true,
        }
      }
    },
    preview: {
      allowedHosts: [".vercel.app", "gene-forge-analyzer.vercel.app"],
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
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs'],
            'chart-vendor': ['recharts'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || '/api'),
      'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(env.VITE_GOOGLE_CLIENT_ID || ''),
      'import.meta.env.VITE_APP_NAME': JSON.stringify(env.VITE_APP_NAME || 'Gene Forge Analyzer'),
    }
  };
});
