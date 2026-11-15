import path from 'path';
import type {Config} from '@docusaurus/types';

const config: Config = {
  title: 'Waypoint demo',
  tagline: 'A guide with one step at a time',
  url: 'https://example.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],
  themes: [path.resolve(__dirname, '..')],
  themeConfig: {
    waypoint: {
      wrapperSelectors: ['.demo-wrapper'],
    },
  },
};

export default config;
