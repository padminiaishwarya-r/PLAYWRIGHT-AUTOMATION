export async function loginToMagento(page) {
  await page.goto(process.env.MAGENTO_ADMIN_URL, {
    waitUntil: 'load',
    timeout: 60000
  });

  await page.fill('#username', process.env.MAGENTO_ADMIN_USER);
  await page.fill('#login', process.env.MAGENTO_ADMIN_PASSWORD);

  await page.click('.actions .action-primary');

  await page.waitForURL('**/dashboard/**', { timeout: 60000 });

  console.log('✅ Logged into Magento Admin');
}