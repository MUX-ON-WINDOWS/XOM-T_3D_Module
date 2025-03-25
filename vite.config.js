import { defineConfig } from "vite";

export default defineConfig({
  base: "./", // Ensures correct paths for deployment
  server: {
    port: 5173,
  },
  build: {
    outDir: "dist",
  },
});
