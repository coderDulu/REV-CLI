import { defineConfig } from "vite";
import dotenv from "dotenv";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

dotenv.config({
  path: path.resolve(__dirname, "../../.env.development"),
});
console.log('process.env.VITE_PORT',process.env.VITE_PORT);
// 加载环境变量
// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  root: "./",
  plugins: [react()],
  build: {
    outDir: path.join(__dirname, "../../dist/renderer"),
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  server: {
    port: Number(process.env.VITE_PORT ?? 5173),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
