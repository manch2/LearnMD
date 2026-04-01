import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { Config } from '../types/index.js';

export async function getMDXOptions(config: Config = {}): Promise<any> {
  const mdxConfig = config.mdx || {};
  const syntaxHighlighter = mdxConfig.syntaxHighlighter || 'prism';

  const remarkPlugins = [
    remarkGfm,
    remarkFrontmatter,
    remarkMdxFrontmatter
  ];

  const rehypePlugins: any[] = [];

  if (syntaxHighlighter === 'prism') {
    try {
      const importDynamic = new Function('modulePath', 'return import(modulePath)');
      const rehypePrism = await importDynamic('rehype-prism-plus');
      rehypePlugins.push([rehypePrism.default, { ignoreMissing: true }]);
    } catch (e) {
      console.warn('rehype-prism-plus not found. Installing it is recommended for Prism syntax highlighting.');
    }
  } else if (syntaxHighlighter === 'rehype-pretty-code') {
    try {
      const importDynamic = new Function('modulePath', 'return import(modulePath)');
      const rehypePrettyCode = await importDynamic('rehype-pretty-code');
      const theme = mdxConfig.theme || { dark: 'github-dark', light: 'github-light' };
      rehypePlugins.push([rehypePrettyCode.default, { theme }]);
    } catch (e) {
      console.error('\n\x1b[31mError: Para usar \'rehype-pretty-code\', instálalo primero ejecutando:\x1b[0m');
      console.error('\x1b[36mpnpm add -D rehype-pretty-code shiki\x1b[0m\n');
      process.exit(1);
    }
  }

  return {
    remarkPlugins,
    rehypePlugins,
    providerImportSource: '@mdx-js/react'
  };
}
