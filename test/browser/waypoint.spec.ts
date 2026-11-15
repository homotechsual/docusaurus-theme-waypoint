import {expect, test} from '@playwright/test';

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
