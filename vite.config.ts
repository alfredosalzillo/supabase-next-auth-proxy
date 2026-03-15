import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
    rolldownOptions: {
      external: ["next", "@supabase/ssr", "next/server"],
      output: {
        exports: "named",
        globals: {},
      },
    },
  },
  plugins: [dts({ rollupTypes: true })],
});
