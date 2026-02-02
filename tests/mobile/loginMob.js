import { test, expect } from '@playwright/test';

test('mobile: open homepage on iPhone', async ({ page }) => {
  test.setTimeout(60000); 
  await page.goto('https://www.caratlane.us');
  //await expect(page.locator('h1')).toBeVisible();
});
