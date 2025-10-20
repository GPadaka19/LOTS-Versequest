import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve as r } from "path";

export default defineConfig(({ mode }) => {
  // buat alias secara kondisional (tanpa push)
  const alias =
    mode === "production"
      ? [
          {
            find: "@stagewise/toolbar-react",
            replacement: r(__dirname, "src/shims/stagewise-toolbar.tsx"),
          },
          {
            find: "@stagewise-plugins/react",
            replacement: r(__dirname, "src/shims/stagewise-react-plugin.ts"),
          },
        ]
      : [];

  return {
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
    resolve: { alias },
  };
});