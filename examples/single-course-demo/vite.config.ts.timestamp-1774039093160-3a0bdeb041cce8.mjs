// vite.config.ts
import { defineConfig } from "file:///C:/Personal/LearnMD%20-%20Projects/LearnMD/node_modules/.pnpm/vite@5.4.21_@types+node@20.19.37/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Personal/LearnMD%20-%20Projects/LearnMD/node_modules/.pnpm/@vitejs+plugin-react@4.7.0_vite@5.4.21_@types+node@20.19.37_/node_modules/@vitejs/plugin-react/dist/index.js";
import mdx from "file:///C:/Personal/LearnMD%20-%20Projects/LearnMD/node_modules/.pnpm/@mdx-js+rollup@3.1.1_rollup@4.59.0/node_modules/@mdx-js/rollup/index.js";
import remarkFrontmatter from "file:///C:/Personal/LearnMD%20-%20Projects/LearnMD/node_modules/.pnpm/remark-frontmatter@5.0.0/node_modules/remark-frontmatter/index.js";
import remarkMdxFrontmatter from "file:///C:/Personal/LearnMD%20-%20Projects/LearnMD/node_modules/.pnpm/remark-mdx-frontmatter@4.0.0/node_modules/remark-mdx-frontmatter/index.js";
import { resolve } from "path";
var __vite_injected_original_dirname = "C:\\Personal\\LearnMD - Projects\\LearnMD\\examples\\single-course-demo";
var vite_config_default = defineConfig({
  plugins: [
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
        providerImportSource: "@mdx-js/react"
      })
    },
    react()
  ],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "./src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxQZXJzb25hbFxcXFxMZWFybk1EIC0gUHJvamVjdHNcXFxcTGVhcm5NRFxcXFxleGFtcGxlc1xcXFxzaW5nbGUtY291cnNlLWRlbW9cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFBlcnNvbmFsXFxcXExlYXJuTUQgLSBQcm9qZWN0c1xcXFxMZWFybk1EXFxcXGV4YW1wbGVzXFxcXHNpbmdsZS1jb3Vyc2UtZGVtb1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovUGVyc29uYWwvTGVhcm5NRCUyMC0lMjBQcm9qZWN0cy9MZWFybk1EL2V4YW1wbGVzL3NpbmdsZS1jb3Vyc2UtZGVtby92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCBtZHggZnJvbSAnQG1keC1qcy9yb2xsdXAnO1xuaW1wb3J0IHJlbWFya0Zyb250bWF0dGVyIGZyb20gJ3JlbWFyay1mcm9udG1hdHRlcic7XG5pbXBvcnQgcmVtYXJrTWR4RnJvbnRtYXR0ZXIgZnJvbSAncmVtYXJrLW1keC1mcm9udG1hdHRlcic7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICB7XG4gICAgICBlbmZvcmNlOiAncHJlJyxcbiAgICAgIC4uLm1keCh7XG4gICAgICAgIHJlbWFya1BsdWdpbnM6IFtyZW1hcmtGcm9udG1hdHRlciwgcmVtYXJrTWR4RnJvbnRtYXR0ZXJdLFxuICAgICAgICBwcm92aWRlckltcG9ydFNvdXJjZTogJ0BtZHgtanMvcmVhY3QnXG4gICAgICB9KVxuICAgIH0sXG4gICAgcmVhY3QoKVxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd1ksU0FBUyxvQkFBb0I7QUFDcmEsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sU0FBUztBQUNoQixPQUFPLHVCQUF1QjtBQUM5QixPQUFPLDBCQUEwQjtBQUNqQyxTQUFTLGVBQWU7QUFMeEIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1A7QUFBQSxNQUNFLFNBQVM7QUFBQSxNQUNULEdBQUcsSUFBSTtBQUFBLFFBQ0wsZUFBZSxDQUFDLG1CQUFtQixvQkFBb0I7QUFBQSxRQUN2RCxzQkFBc0I7QUFBQSxNQUN4QixDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDakM7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
