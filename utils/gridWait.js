export async function waitForGridToStabilize(page) {

  await page.waitForLoadState('domcontentloaded');

  // Wait for loader to disappear
  await page.waitForSelector('.admin__data-grid-loading-mask', {
    state: 'hidden',
    timeout: 15000
  }).catch(() => {});

  // Small stability wait
  await page.waitForTimeout(1000);
}