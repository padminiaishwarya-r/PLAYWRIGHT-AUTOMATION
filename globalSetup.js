import { chromium } from '@playwright/test';
import fs from 'fs';

export default async function globalSetup() {
  const browser = await chromium.launch();
  const version = browser.version(); 
  await browser.close();
  fs.writeFileSync('./browser-meta.json', JSON.stringify({ chromiumVersion: version }));
}
