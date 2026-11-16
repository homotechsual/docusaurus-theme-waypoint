import {expect, test} from '@playwright/test';

function contrastRatio(foreground: string, background: string) {
  const luminance = (color: string) => {
    const channels = color.match(/\d+/g)?.slice(0, 3).map(Number);
    if (!channels || channels.length !== 3) {
      throw new Error(`Unexpected computed color: ${color}`);
    }

    const [red, green, blue] = channels.map((channel) => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };

  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);
  return (
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
  );
}

test('navbar offers sponsorship and an accessible GitHub icon on desktop and mobile', async ({page}) => {
  for (const viewport of [{width: 1280, height: 800}, {width: 390, height: 844}]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    if (viewport.width < 997) {
      await page.getByRole('button', {name: 'Toggle navigation bar'}).click();
    }
    const navigation = viewport.width < 997 ? page.locator('.navbar-sidebar') : page.locator('.navbar__items--right');
    const sponsor = navigation.getByRole('link', {name: 'Sponsor'});
    await expect(sponsor).toBeVisible();
    await expect(sponsor).toHaveAttribute('href', 'https://github.com/sponsors/homotechsual');
    expect(await sponsor.evaluate((element) => getComputedStyle(element, '::before').backgroundImage)).not.toBe('none');
    const github = navigation.getByRole('link', {name: /GitHub/});
    await expect(github).toBeVisible();
    await expect(github).toHaveAttribute('href', 'https://github.com/homotechsual/docusaurus-theme-waypoint');
    expect(await github.evaluate((element) => getComputedStyle(element, '::before').maskImage)).not.toBe('none');
    if (viewport.width === 1280) {
      await expect(github.locator('.navbar__action-label')).toBeHidden();
      await expect(sponsor.locator('.navbar__action-label')).toBeHidden();
    } else {
      await expect(github.locator('.navbar__action-label')).toBeVisible();
      await expect(sponsor.locator('.navbar__action-label')).toBeVisible();
    }
  }
});

test('homepage links to the demo and documentation', async ({page}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', {name: 'Waypoint for Docusaurus', level: 1})).toBeVisible();
  await expect(page.getByRole('heading', {name: 'One guide, two views'})).toBeVisible();
  await expect(page.getByRole('heading', {name: 'Inspired by dotMARC'})).toBeVisible();
  await expect(page.getByRole('link', {name: 'Explore the dotMARC deployment guide →'}))
    .toHaveAttribute('href', 'https://dotmarc.app/docs/deploy-with-docker/');
  await page.getByRole('link', {name: 'Read the Docs'}).click();
  await expect(page).toHaveURL(/\/docs\/intro\/?$/);
  await expect(page.getByRole('heading', {name: 'Installation'})).toBeVisible();
  await expect(page.getByRole('link', {name: 'Docker deployment guide'}))
    .toHaveAttribute('href', 'https://dotmarc.app/docs/deploy-with-docker/');
  await expect(page.getByRole('group', {name: 'How to read this guide'})).toHaveCount(0);
  await expect(page.getByRole('tab', {name: 'npm', exact: true})).toBeVisible();
  await page.getByRole('tab', {name: 'yarn'}).click();
  await expect(page.getByText('yarn add @homotechsual/docusaurus-theme-waypoint')).toBeVisible();
  await page.getByRole('link', {name: 'Demo guide'}).first().click();
  await expect(page).toHaveURL(/\/docs\/guide\/?$/);
});

test.beforeEach(async ({page}) => {
  await page.goto('/docs/guide');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('switches between the whole guide and one step at a time', async ({page}) => {
  await expect(page.getByRole('heading', {name: 'Finish'})).toBeVisible();
  await page.getByRole('button', {name: 'One step at a time'}).click();

  await page.getByRole('combobox', {name: 'Jump to a step'}).selectOption({label: 'Install'});
  await expect(page.getByRole('heading', {name: 'Install'})).toBeVisible();
  await expect(page.getByRole('heading', {name: 'Configure'})).toBeHidden();

  await page.getByRole('button', {name: 'Next'}).click();
  await expect(page.getByRole('heading', {name: 'Install'})).toBeHidden();
  await expect(page.getByRole('heading', {name: 'Wrapped step'})).toBeVisible();

  await page.getByRole('button', {name: 'Whole guide'}).click();
  await expect(page.getByRole('heading', {name: 'Finish'})).toBeVisible();
});

test('active mode switch text meets WCAG AA contrast in light and dark themes', async ({page}) => {
  const activeButton = page.getByRole('group', {name: 'How to read this guide'}).getByRole('button', {name: 'Whole guide'});

  for (const theme of ['light', 'dark']) {
    await page.evaluate((value) => document.documentElement.setAttribute('data-theme', value), theme);
    const colors = await activeButton.evaluate((element) => {
      const style = getComputedStyle(element);
      return {foreground: style.color, background: style.backgroundColor};
    });

    expect(contrastRatio(colors.foreground, colors.background)).toBeGreaterThanOrEqual(4.5);
  }
});

test('a document can group subheadings into parent steps and link directly to them', async ({page}) => {
  await page.goto('/docs/parent-steps');
  await page.getByRole('button', {name: 'One step at a time'}).click();
  const jump = page.getByRole('combobox', {name: 'Jump to a step'});
  await expect(jump.locator('option')).toHaveText(['Overview', 'Prepare', 'Deploy']);
  await jump.selectOption({label: 'Prepare'});
  await expect(page.getByRole('heading', {name: 'Check prerequisites'})).toBeVisible();
  await expect(page.getByRole('heading', {name: 'Install dependencies'})).toBeVisible();
  await expect(page.getByRole('heading', {name: 'Start the service'})).toBeHidden();

  await page.goto('/docs/parent-steps#start-the-service');
  await expect(page.getByRole('heading', {name: 'Start the service'})).toBeVisible();
  await expect(page.getByRole('heading', {name: 'Check prerequisites'})).toBeHidden();
  await expect(page.getByRole('combobox', {name: 'Jump to a step'})).toHaveValue('2');
  await page.getByRole('button', {name: 'Whole guide'}).click();
  await expect(page.getByRole('heading', {name: 'Check prerequisites'})).toBeVisible();
});

test('a document can opt into heading levels that start their own steps', async ({page}) => {
  await page.goto('/docs/heading-levels');
  await page.getByRole('button', {name: 'One step at a time'}).click();

  const jump = page.getByRole('combobox', {name: 'Jump to a step'});
  await expect(jump.locator('option')).toHaveText([
    'Overview',
    'Prepare',
    'Check prerequisites',
    'Deploy',
    'Start the service',
  ]);
  await jump.selectOption({label: 'Check prerequisites'});
  await expect(page.getByRole('heading', {name: 'Verify the setup'})).toBeVisible();
});

test('jump menu and links reveal the selected step and update the hash', async ({page}) => {
  await page.getByRole('button', {name: 'One step at a time'}).click();

  const jumpMenu = page.getByRole('combobox', {name: 'Jump to a step'});
  await jumpMenu.selectOption({label: 'Configure'});
  await expect(page.getByRole('heading', {name: 'Configure'})).toBeVisible();
  await expect(page).toHaveURL(/#configure$/);

  await jumpMenu.selectOption({label: 'Overview'});
  await page.getByRole('link', {name: 'Jump directly to Configure'}).click();
  await expect(page.getByRole('heading', {name: 'Configure'})).toBeVisible();
  await expect(page).toHaveURL(/#configure$/);

  await jumpMenu.selectOption({label: 'Wrapped step'});
  await expect(page.getByRole('heading', {name: 'Wrapped step'})).toBeVisible();
});

test('checklist items move into their steps and retain their state', async ({page}) => {
  await page.getByRole('button', {name: 'One step at a time'}).click();
  await page.getByRole('combobox', {name: 'Jump to a step'}).selectOption({label: 'Install'});
  const doneCheckbox = page.getByRole('checkbox', {name: 'Done: Install the package'});
  await doneCheckbox.click();
  await expect(doneCheckbox).toBeChecked();

  await page.getByRole('button', {name: 'Whole guide'}).click();
  await expect(page.getByRole('checkbox', {name: 'Install the package'})).toBeChecked();
});

test('shows the full guide when JavaScript is disabled', async ({browser}) => {
  const context = await browser.newContext({javaScriptEnabled: false});
  const page = await context.newPage();

  await page.goto('/docs/guide');

  await expect(page.getByRole('heading', {name: 'Install'})).toBeVisible();
  await expect(page.getByRole('heading', {name: 'Wrapped step'})).toBeVisible();
  await expect(page.getByRole('heading', {name: 'Configure'})).toBeVisible();
  await expect(page.getByRole('heading', {name: 'Finish'})).toBeVisible();

  await context.close();
});
