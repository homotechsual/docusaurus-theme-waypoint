import path from 'path';
import type {Config} from '@docusaurus/types';

const config: Config = {
  title: 'Waypoint demo',
  tagline: 'A guide with one step at a time',
  url: 'https://waypoint.docusaurus.homotechsual.dev',
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
    navbar: {
      title: 'Waypoint',
      items: [
        {to: '/docs/guide', label: 'Demo guide', position: 'left'},
        {href: 'https://github.com/homotechsual/docusaurus-theme-waypoint', label: 'GitHub', position: 'right'},
        {href: 'https://www.npmjs.com/package/@homotechsual/docusaurus-theme-waypoint', label: 'npm', position: 'right'},
      ],
    },
    waypoint: {
      wrapperSelectors: ['.demo-wrapper'],
    },
  },
};

export default config;
