import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During dev, requests to /api are proxied to the FastAPI backend on :8000,
// so the frontend can call same-origin URLs without CORS concerns.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
});
