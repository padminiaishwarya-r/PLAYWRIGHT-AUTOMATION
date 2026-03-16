export async function loginToMagento(page) {
  await page.goto(process.env.MAGENTO_ADMIN_URL, {
    waitUntil: 'domcontentloaded'
  });

  await page.fill('#username', process.env.MAGENTO_ADMIN_USER);
  await page.fill('#login', process.env.MAGENTO_ADMIN_PASSWORD);
  await page.click('button.action-login');

  await page.waitForURL('**/dashboard/**', { timeout: 30000 });

  console.log('✅ Logged into Magento');

  const enrollmentLink = page.locator('a[href*="goldscheme/enrollment"]').first();
  const goldParent = page.locator('.admin__menu a, .menu-item').filter({ hasText: /Goldscheme|Gold Scheme/i }).first();

  if (await goldParent.isVisible().catch(() => false)) {
    await goldParent.click();
    await page.waitForTimeout(800);
  }

  if (await enrollmentLink.isVisible().catch(() => false)) {
    await enrollmentLink.click();
  } else {
    const href = await page.evaluate(() => {
      const a = document.querySelector('a[href*="goldscheme/enrollment"]');
      return a ? a.getAttribute('href') : null;
    });
    if (href) await page.goto(href, { waitUntil: 'networkidle' });
    else await page.getByRole('link', { name: /Enrollment/i }).click();
  }

  await page.waitForLoadState('networkidle');
  console.log('✅ Navigated to Enrollment grid');
}