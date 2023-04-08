/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "simple-peer": "simple-peer/simplepeer.min.js",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/testSetup.tsx",
  },
});