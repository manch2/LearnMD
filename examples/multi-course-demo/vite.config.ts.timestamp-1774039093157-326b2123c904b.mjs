// vite.config.ts
import { defineConfig } from "file:///C:/Personal/LearnMD%20-%20Projects/LearnMD/node_modules/.pnpm/vite@5.4.21_@types+node@20.19.37/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Personal/LearnMD%20-%20Projects/LearnMD/node_modules/.pnpm/@vitejs+plugin-react@4.7.0_vite@5.4.21_@types+node@20.19.37_/node_modules/@vitejs/plugin-react/dist/index.js";
import mdx from "file:///C:/Personal/LearnMD%20-%20Projects/LearnMD/node_modules/.pnpm/@mdx-js+rollup@3.1.1_rollup@4.59.0/node_modules/@mdx-js/rollup/index.js";
import remarkGfm from "file:///C:/Personal/LearnMD%20-%20Projects/LearnMD/node_modules/.pnpm/remark-gfm@4.0.1/node_modules/remark-gfm/index.js";
import remarkFrontmatter from "file:///C:/Personal/LearnMD%20-%20Projects/LearnMD/node_modules/.pnpm/remark-frontmatter@5.0.0/node_modules/remark-frontmatter/index.js";
import remarkMdxFrontmatter from "file:///C:/Personal/LearnMD%20-%20Projects/LearnMD/node_modules/.pnpm/remark-mdx-frontmatter@4.0.0/node_modules/remark-mdx-frontmatter/index.js";
import { resolve } from "path";
var __vite_injected_original_dirname = "C:\\Personal\\LearnMD - Projects\\LearnMD\\examples\\multi-course-demo";
var vite_config_default = defineConfig({
  plugins: [
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter],
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxQZXJzb25hbFxcXFxMZWFybk1EIC0gUHJvamVjdHNcXFxcTGVhcm5NRFxcXFxleGFtcGxlc1xcXFxtdWx0aS1jb3Vyc2UtZGVtb1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcUGVyc29uYWxcXFxcTGVhcm5NRCAtIFByb2plY3RzXFxcXExlYXJuTURcXFxcZXhhbXBsZXNcXFxcbXVsdGktY291cnNlLWRlbW9cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1BlcnNvbmFsL0xlYXJuTUQlMjAtJTIwUHJvamVjdHMvTGVhcm5NRC9leGFtcGxlcy9tdWx0aS1jb3Vyc2UtZGVtby92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCBtZHggZnJvbSAnQG1keC1qcy9yb2xsdXAnO1xuaW1wb3J0IHJlbWFya0dmbSBmcm9tICdyZW1hcmstZ2ZtJztcbmltcG9ydCByZW1hcmtGcm9udG1hdHRlciBmcm9tICdyZW1hcmstZnJvbnRtYXR0ZXInO1xuaW1wb3J0IHJlbWFya01keEZyb250bWF0dGVyIGZyb20gJ3JlbWFyay1tZHgtZnJvbnRtYXR0ZXInO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAge1xuICAgICAgZW5mb3JjZTogJ3ByZScsXG4gICAgICAuLi5tZHgoe1xuICAgICAgICByZW1hcmtQbHVnaW5zOiBbcmVtYXJrR2ZtLCByZW1hcmtGcm9udG1hdHRlciwgcmVtYXJrTWR4RnJvbnRtYXR0ZXJdLFxuICAgICAgICBwcm92aWRlckltcG9ydFNvdXJjZTogJ0BtZHgtanMvcmVhY3QnXG4gICAgICB9KVxuICAgIH0sXG4gICAgcmVhY3QoKVxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcVksU0FBUyxvQkFBb0I7QUFDbGEsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sU0FBUztBQUNoQixPQUFPLGVBQWU7QUFDdEIsT0FBTyx1QkFBdUI7QUFDOUIsT0FBTywwQkFBMEI7QUFDakMsU0FBUyxlQUFlO0FBTnhCLElBQU0sbUNBQW1DO0FBUXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQO0FBQUEsTUFDRSxTQUFTO0FBQUEsTUFDVCxHQUFHLElBQUk7QUFBQSxRQUNMLGVBQWUsQ0FBQyxXQUFXLG1CQUFtQixvQkFBb0I7QUFBQSxRQUNsRSxzQkFBc0I7QUFBQSxNQUN4QixDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDakM7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
