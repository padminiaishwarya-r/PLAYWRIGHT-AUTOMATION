import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  retries: 1,
  workers: 1,

  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/test-results.json' }],
  ],

  globalSetup: './global-setup.js',

  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'Chrome',
      use: {
        browserName: 'chromium',
        headless: false,
        viewport: null,
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
    },
  ],
});
