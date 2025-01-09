import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "UNRESOLVED_IMPORT") {
          console.error("Unresolved import:", warning);
          return;
        }
        warn(warning);
      },
    },
  },
});

// git add .
// git commit -m "completed my project"
// git push origin main
