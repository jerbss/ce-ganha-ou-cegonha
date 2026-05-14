import { defineConfig } from "vite";

export default defineConfig({
  base: "/ce-ganha-ou-cegonha/",
  server: {
    port: 5173,
    open: true
  },
  build: {
    target: "esnext"
  }
});
