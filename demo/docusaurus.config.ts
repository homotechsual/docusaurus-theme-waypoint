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
      logo: {alt: 'Waypoint', src: 'img/favicon.svg'},
      items: [
        {to: '/docs/guide', label: 'Demo guide', position: 'left'},
        {type: 'docSidebar', sidebarId: 'docs', label: 'Docs', position: 'left'},
        {
          label: 'More Projects',
          position: 'right',
          items: [
            {label: 'OpenGraph', href: 'https://og.docusaurus.homotechsual.dev/'},
            {label: 'FAQs', href: 'https://faqs.docusaurus.homotechsual.dev/'},
            {label: 'Showcase', href: 'https://showcase.docusaurus.homotechsual.dev/'},
            {label: 'Plausible', href: 'https://plausible.docusaurus.homotechsual.dev/'},
            {label: 'All Projects', href: 'https://docs.homotechsual.dev/'},
          ],
        },
        {href: 'https://github.com/sponsors/homotechsual', html: '<span class="navbar__action-label">Sponsor</span>', 'aria-label': 'Sponsor', title: 'Sponsor', position: 'right', className: 'sponsorship-link'},
        {href: 'https://github.com/homotechsual/docusaurus-theme-waypoint', html: '<span class="navbar__action-label">GitHub</span>', 'aria-label': 'GitHub', title: 'GitHub', position: 'right', className: 'github-link'},
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
        {
          title: 'Docusaurus projects',
          items: [
            {label: 'OpenGraph', href: 'https://og.docusaurus.homotechsual.dev/'},
            {label: 'FAQs', href: 'https://faqs.docusaurus.homotechsual.dev/'},
            {label: 'Showcase', href: 'https://showcase.docusaurus.homotechsual.dev/'},
            {label: 'Plausible', href: 'https://plausible.docusaurus.homotechsual.dev/'},
            {label: 'Waypoint', href: 'https://waypoint.docusaurus.homotechsual.dev/'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Mikey O'Toole.<br />Built with <a href="https://docusaurus.io">Docusaurus v${DOCUSAURUS_VERSION}</a>.<br /><span class="designedBy">Designed with <svg xmlns="http://www.w3.org/2000/svg" class="heart" role="img" aria-label="love" width="24" height="24" viewBox="0 0 24 24"><path d="M14 20.408c-.492.308-.903.546-1.192.709-.153.086-.308.17-.463.252h-.002a.75.75 0 01-.686 0 16.709 16.709 0 01-.465-.252 31.147 31.147 0 01-4.803-3.34C3.8 15.572 1 12.331 1 8.513 1 5.052 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262A31.146 31.146 0 0114 20.408z"/></svg> by <a href="https://homotechsual.dev">homotechsual</a></span>`,
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
