import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(async () => {
  const [{ default: mdx }, { default: remarkGfm }, { default: remarkFrontmatter }, { default: remarkMdxFrontmatter }] =
    await Promise.all([
      import('@mdx-js/rollup'),
      import('remark-gfm'),
      import('remark-frontmatter'),
      import('remark-mdx-frontmatter'),
    ]);

  return {
    plugins: [
      {
        enforce: 'pre',
        ...mdx({
          remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter],
          providerImportSource: '@mdx-js/react',
        }),
      },
      react(),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
      dedupe: ['react', 'react-dom', '@learnmd/core'],
    },
  };
});
