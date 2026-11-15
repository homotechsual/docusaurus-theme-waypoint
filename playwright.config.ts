import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './test/browser',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    channel: 'msedge',
    headless: true,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'yarn workspace waypoint-demo serve --host 127.0.0.1 --port 4173 --no-open',
    url: 'http://127.0.0.1:4173/docs/guide',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
