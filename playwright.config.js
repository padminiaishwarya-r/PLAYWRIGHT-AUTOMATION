import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

const ENV = process.env.ENV || 'live';

dotenv.config({ path: '.env.live' });


console.log(`🚀 Running tests on: ${ENV.toUpperCase()}`);

export default defineConfig({
  testDir: './tests',
  timeout: 180000,
  retries: 0,
  workers: 1,

  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/test-results.json' }],
  ],

  globalSetup: './global-setup.js',

  use: {
    headless: true,
    baseURL: process.env.BASE_URL, // 🔑 THIS IS REQUIRED
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
