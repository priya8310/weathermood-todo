import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Lets `npm start` work behind Render / Railway domains.
  preview: { allowedHosts: true },
});
