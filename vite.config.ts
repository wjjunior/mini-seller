import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/app": "/src/app",
      "@/app/*": "/src/app/*",
      "@/pages": "/src/pages",
      "@/pages/*": "/src/pages/*",
      "@/features": "/src/features",
      "@/features/*": "/src/features/*",
      "@/entities": "/src/entities",
      "@/entities/*": "/src/entities/*",
      "@/shared": "/src/shared",
      "@/shared/*": "/src/shared/*",
      "@/components": "/src/components",
      "@/components/*": "/src/components/*",
      "@/test": "/src/test",
      "@/test/*": "/src/test/*",
    },
  },
});
