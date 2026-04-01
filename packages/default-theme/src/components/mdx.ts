import { Callout } from './Callout';
import { Paragraph } from './Paragraph';
import { Title } from './Title';
import { Quiz } from './Quiz';
import { Progress } from './Progress';
import { VideoEmbed } from './VideoEmbed';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CodeBlock } from './CodeBlock';

export const defaultMDXComponents = {
  Callout,
  Quiz,
  VideoEmbed,
  Progress,
  LanguageSwitcher,
  Paragraph,
  Title,
  pre: CodeBlock,
};
