import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: { exclude: ["lucide-react"] },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
          ui: [
            "lucide-react",
            "@fortawesome/react-fontawesome",
            "@fortawesome/free-brands-svg-icons",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
