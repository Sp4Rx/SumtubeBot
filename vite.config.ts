import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load env file from project root
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_DISCORD_APPLICATION_ID': JSON.stringify(env.VITE_DISCORD_APPLICATION_ID),
    },
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    root: path.resolve(import.meta.dirname, "client"),
    envDir: path.resolve(import.meta.dirname), // Look for .env files in project root
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/client"),
      emptyOutDir: true,
    },
    server: {
      port: 5173,
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
