import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.PNG"],
  preview: {
    port: 8080,
    strictPort: true,
  },
  server: {
    open: true,
    port: 3000,
  },
});
