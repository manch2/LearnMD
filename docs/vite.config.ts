import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import { getMDXOptions } from '@learnmd/core';
import learnMdConfig from './learnmd.config';
import { resolve } from 'path';

export default defineConfig(async () => {
  const mdxOptions = await getMDXOptions(learnMdConfig);

  return {
    base: '/LearnMD/',
    plugins: [
      {
        enforce: 'pre',
        ...mdx(mdxOptions)
      },
      react()
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
      dedupe: ['react', 'react-dom', 'react-router-dom', '@mdx-js/react', '@learnmd/core']
    },
  };
});
