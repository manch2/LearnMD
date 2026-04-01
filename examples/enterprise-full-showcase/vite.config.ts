import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { getMDXOptions } from '@learnmd/core';
import learnMdConfig from './learnmd.config';
import { resolve } from 'path';

export default defineConfig(async () => {
  const [{ default: mdx }] = await Promise.all([
    import('@mdx-js/rollup')
  ]);

  const mdxOptions = await getMDXOptions(learnMdConfig);

  return {
    plugins: [
      {
        enforce: 'pre',
        ...mdx(mdxOptions),
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
