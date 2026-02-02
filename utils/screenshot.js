import fs from 'fs';
import path from 'path';

export async function takeScreenshot(page, name) {
  const dir = 'playwright-report/screenshots';
  await fs.promises.mkdir(dir, { recursive: true });
  const filePath = path.join(dir, `${name}.png`);
  await page.screenshot({ path: filePath, fullPage: true });
}
