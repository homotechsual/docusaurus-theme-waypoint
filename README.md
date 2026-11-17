# Waypoint

`@homotechsual/docusaurus-theme-waypoint` lets readers switch a long Docusaurus guide to **one step at a time**: a *Whole guide / One step at a time* switch, a
progress bar, a jump menu, Back and Next buttons, and optional "done" ticks for each step. For readers who find a long
page overwhelming.

It is a single page of content shown two ways, not two versions of it. In step mode the theme sorts the rendered
article into groups at each heading and hides all but the current one. Switching back to *Whole guide* restores the
page exactly. Without JavaScript the full page is shown.

This repository is the source of truth for `@homotechsual/docusaurus-theme-waypoint`.

## Use it

Add the theme, and opt a doc in with front matter:

```ts
// docusaurus.config.ts
themes: ['@homotechsual/docusaurus-theme-waypoint'],
themeConfig: {
  waypoint: {
    // All optional. These are the defaults.
    frontMatterKey: 'waypoint', // docs with `waypoint: true` get the switch
    headingLevels: [2, 3], // heading levels that start a step
    storageNamespace: 'waypoint', // prefix for what is saved in the reader's localStorage
    showIntroHint: true, // the "New: read this one step at a time" callout for first-time visitors
    articleSelector: '.theme-doc-markdown', // where the guide's content lives (see "Different page structures")
    wrapperSelectors: [], // wrapper elements to look inside
  },
},
```

```md
---
waypoint: true
---

# My guide

Intro text is the first step ("Overview").

## Install

## Configure
```

Every heading at the configured levels is a step. A heading at a level below the highest one is shown indented in the
jump menu.

Set `headingLevels: [2]` site-wide to keep H3 and lower headings in their parent H2 step. To override the site-wide
setting for one opted-in document, add a non-empty array of levels from 2 through 6 to its front matter:

```yaml
waypoint: true
waypointHeadingLevels: [2]
```

The override is named `waypointHeadingLevels` even if `frontMatterKey` is customised. Headings at other levels remain
in the preceding step, or in the overview before the first step. With the default `[2, 3]`, an H2 immediately
followed by an H3 produces an H2 step containing only its heading; add content between them or use `[2]` to include
the H3 in its parent step. Checklist items must reference an actual step heading, so with `[2]` use the parent H2 ID
instead of an H3 ID.

## Colours

The stuck progress bar should match your page background so it doesn't show up as a panel. Set this to your page colour
(it defaults to `--ifm-background-surface-color`):

```css
:root {
  --waypoint-bar-background: #f7f8fa;
}
[data-theme='dark'] {
  --waypoint-bar-background: #111827;
}
```

The active mode switch uses `--ifm-font-color-base-inverse` for its text. If you customize the primary color, make sure
that foreground has at least 4.5:1 contrast against it.

## Different page structures

By default the theme looks at the children of Docusaurus' `.theme-doc-markdown` element. Two settings cover other
structures:

- `articleSelector` is a CSS selector (or a list, as an array or comma-separated) for the element or elements whose
  children are the guide's content. Several matches are read as one guide, in page order. Use it for a custom doc
  layout, or to add a second parent that holds part of the content.
- `wrapperSelectors` lists wrapper elements to look inside. A heading in a matching wrapper starts a step just as if
  it were a direct child of the article, so you can keep wrapping content in your own components:

```ts
waypoint: {
  articleSelector: ['.theme-doc-markdown', '.my-extra-parent'],
  wrapperSelectors: ['.my-section', '.my-callout-group'],
},
```

The wrappers themselves stay on screen, so one with its own border or padding can leave an empty box in the steps it
has nothing in.

## Ticks: the checklist component

The theme includes a checklist whose ticks are saved in the reader's browser (under your `storageNamespace`). Give each
item the id of the heading it belongs to, and in step mode the list is replaced by a "Done" tick at the end of each
step:

```mdx
import Checklist from '@theme/Waypoint/Checklist';

<Checklist
  id="install-guide"
  items={[
    {text: 'Installed the CLI', step: 'install'},
    {text: 'Signed in', step: 'sign-in'},
  ]}
/>
```

- Items can also be plain strings. A list only moves into the steps when **every** item names a step. Otherwise it
  stays where you put it, in both views.
- `id` is part of the saved key. Keep it unique and unchanged, or readers' ticks reset.
- `onProgress(completed, total)` is called as ticks change, so you can feed your own page-wide progress display.
- The whole-guide list and the per-step ticks share the same saved state.

## Your own checklist

A checklist component of your own can show its items one per step by registering them with the tasks hook:

```tsx
import {useWaypointTasks, HIDE_IN_STEPS_ATTRIBUTE} from '@theme/Waypoint/tasks';

const registry = useWaypointTasks(); // null outside a Waypoint guide

useEffect(() => {
  registry?.register('my-checklist', [
    {stepId: 'install', label: 'Installed it', checked, toggle},
  ]);
  return () => registry?.register('my-checklist', null);
}, [registry, checked]);

// Put this attribute on the checklist's root element so the full list hides in step mode:
<div {...{[HIDE_IN_STEPS_ATTRIBUTE]: ''}}>…</div>
```

`stepId` is the id of the step's heading. If a heading is renamed its id changes, and its task silently stops appearing
in step mode, so keep the ids in step with your headings.

## Translations

All visible text goes through Docusaurus' `translate()` with ids starting `theme.waypoint.`. Run
`docusaurus write-translations` to get them.

## Limits

- It works on the rendered page, so a heading only starts a step when it is a direct child of the article or of a
  wrapper named in `wrapperSelectors`. Headings inside anything else (tabs, details, an unlisted component) do not.
- It relies on Docusaurus 3's `.theme-doc-markdown` article element.
- Printing prints the current step. Switch to *Whole guide* first.
- The page logic (`theme/Waypoint/steps.ts`) is tested with `node --test test/steps.test.mjs`.

## Development

The repository uses Yarn 4 workspaces. Install dependencies with `yarn install`, then run:

```sh
yarn build
yarn typecheck
yarn workspace waypoint-demo build
yarn test
```

The demo site in `demo/` exercises a guide with custom wrappers and a checklist. Browser tests use Microsoft Edge
through Playwright. CI builds the package and demo, runs the unit and browser tests, and checks TypeScript.
The [demo site](https://waypoint.docusaurus.homotechsual.dev/) also provides a getting-started guide and reference
pages for configuration, checklists and reader behaviour.

The demo homepage displays the package version and links to the current release.
Production builds generate OpenGraph images for documentation and pages using
`@homotechsual/docusaurus-og` and locally installed Inter fonts. Plausible tracking
is configured for `waypoint.docusaurus.homotechsual.dev`; both integrations are
demo-only and are not enabled automatically for theme consumers.

The demo is configured for `https://waypoint.docusaurus.homotechsual.dev/`. The Deploy Demo workflow publishes to the
Cloudflare Pages project `docusaurus-waypoint` on pushes to `main` and creates previews for pull requests from this
repository. Configure the `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` GitHub Actions secrets, then add the
custom domain in Cloudflare Pages and configure its DNS. Fork pull requests do not deploy because they cannot safely
access the deployment secrets.

The package is licensed under Apache-2.0, matching the other Docusaurus packages maintained alongside it.

## Publishing

Publish the first version manually with an npm account authorized for the `@homotechsual` scope:

```sh
yarn install --immutable
yarn build
npm publish --access public
```

Then configure a GitHub Actions trusted publisher in the package's npm settings:

- Owner: `homotechsual`
- Repository: `docusaurus-theme-waypoint`
- Workflow filename: `publish.yml`
- Environment: `npm`

The GitHub repository must match the package's `repository.url`, and its `npm` environment must allow the release
workflow to run. The workflow uses OIDC and does not require an npm publishing token. See the
[npm trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/).

After the manual first publish, bump the version before creating a GitHub release that triggers the publish workflow.
The workflow publishes the version in `package.json`, and npm will reject an already published version.
