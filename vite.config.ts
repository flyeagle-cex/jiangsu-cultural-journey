import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

import { shuiLingApiPlugin } from "./server/shuiling/vite-adapter.ts";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const environment = { ...process.env, ...loadEnv(mode, projectRoot, "") };

  return {
    plugins: [react(), shuiLingApiPlugin(environment)],
    resolve: {
      alias: {
        "@": path.resolve(projectRoot, "./src"),
      },
    },
  };
});
