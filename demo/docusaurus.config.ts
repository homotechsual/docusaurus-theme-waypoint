import path from 'path';
import type {Config} from '@docusaurus/types';
import {DOCUSAURUS_VERSION} from '@docusaurus/utils';
import npm2yarn from '@docusaurus/remark-plugin-npm2yarn';
import {themes as prismThemes} from 'prism-react-renderer';

const config: Config = {
  title: 'Waypoint for Docusaurus',
  tagline: 'Help readers navigate long guides one step at a time',
  favicon: 'img/favicon.svg',
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
          remarkPlugins: [[npm2yarn, {converters: ['yarn', 'pnpm', 'bun'], sync: true}]],
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
      title: 'Waypoint Theme',
      items: [
        {to: '/docs/guide', label: 'Demo guide', position: 'left'},
        {type: 'docSidebar', sidebarId: 'docs', label: 'Docs', position: 'left'},
        {href: 'https://docs.homotechsual.dev/', label: 'Other Projects', position: 'right'},
        {href: 'https://github.com/homotechsual/docusaurus-theme-waypoint', label: 'GitHub', position: 'right', className: 'github-link'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Waypoint',
          items: [
            {label: 'Demo guide', to: '/docs/guide'},
            {label: 'Getting started', to: '/docs/intro'},
            {label: 'Configuration', to: '/docs/configuration'},
            {label: 'Checklists', to: '/docs/checklists'},
          ],
        },
        {
          title: 'Links',
          items: [
            {label: 'GitHub', href: 'https://github.com/homotechsual/docusaurus-theme-waypoint'},
            {label: 'npm', href: 'https://www.npmjs.com/package/@homotechsual/docusaurus-theme-waypoint'},
            {label: 'Other Projects', href: 'https://docs.homotechsual.dev/'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Mikey O'Toole.<br />Built with <a href="https://docusaurus.io">Docusaurus v${DOCUSAURUS_VERSION}</a>.<br /><span class="designedBy">Designed with <span class="heart" aria-label="love">♥</span> by <a href="https://homotechsual.dev">homotechsual</a></span>`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    waypoint: {
      wrapperSelectors: ['.demo-wrapper'],
    },
  },
};

export default config;
