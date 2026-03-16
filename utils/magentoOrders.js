import { expect } from '@playwright/test';
import { getYesterdayPSTDateForMagento } from './dateUtils.js';
import { waitForGridToStabilize } from './magentoWaits.js';

const STATUSES = [
  'Order Received',
  'Shipped',
  'In Progress'
];

/* ---------- Read "X records found" safely ---------- */
async function readSummaryCount(page) {
  const summary = page.locator('.admin__control-support-text').first();

  await expect(summary).toBeVisible({ timeout: 20000 });
  await expect(summary).toContainText(/\d+/, { timeout: 20000 });

  const text = await summary.innerText();
  return Number(text.match(/\d+/)?.[0] ?? 0);
}

/* ---------- Wait for Magento grid refresh ---------- */
async function waitForGridRefresh(page) {
  const spinnerSelector =
    'div[data-role="spinner"].admin__data-grid-loading-mask';

  await page.waitForSelector(spinnerSelector, {
    state: 'visible',
    timeout: 5000
  }).catch(() => {});

  await page.waitForSelector(spinnerSelector, {
    state: 'hidden',
    timeout: 30000
  });

  await page.waitForTimeout(500);
}

/* ---------- Expand Filter Panel Safely ---------- */
async function openFilters(page) {
  const filterWrap = page.locator('.admin__data-grid-filters-wrap');

  if (await filterWrap.isVisible().catch(() => false)) {
    return; // Already open
  }

  const filterBtn = page.locator('[data-action="grid-filter-expand"]').first();

  await filterBtn.waitFor({ state: 'visible', timeout: 15000 });

  await waitForGridToStabilize(page);

  await filterBtn.click();

  await filterWrap.waitFor({ state: 'visible', timeout: 20000 });
}



  

/* ---------- Clear Filters Safely ---------- */
async function clearFiltersIfPresent(page) {
  const resetExists = await page
    .locator('[data-action="grid-filter-reset"]')
    .count();

  if (resetExists > 0) {
    await page.evaluate(() => {
      const btn = document.querySelector(
        '[data-action="grid-filter-reset"]'
      );
      if (btn) btn.click();
    });

    await waitForGridRefresh(page);
  }
}

/* ---------- Apply Filters Safely ---------- */
async function applyFilters(page) {
  await page.evaluate(() => {
    const btn = document.querySelector(
      '[data-action="grid-filter-apply"]'
    );
    if (btn) btn.click();
  });

  await waitForGridRefresh(page);
}

/* ---------- Set Date Fields via JS (Knockout Safe) ---------- */
async function setDateFilters(page, date) {
  await page.evaluate((pstDate) => {
    const from = document.querySelector(
      'input[name="created_at[from]"]'
    );
    const to = document.querySelector(
      'input[name="created_at[to]"]'
    );

    if (from) {
      from.value = pstDate;
      from.dispatchEvent(
        new Event('change', { bubbles: true })
      );
    }

    if (to) {
      to.value = pstDate;
      to.dispatchEvent(
        new Event('change', { bubbles: true })
      );
    }
  }, date);
}

/* ---------- Main Logic ---------- */
export async function getYesterdayOrdersCountByStatus(page) {
  const pstDate = getYesterdayPSTDateForMagento();
  const counts = {};

  await page.goto(
    `${process.env.MAGENTO_ADMIN_URL}sales/order/index`,
    { waitUntil: 'domcontentloaded' }
  );

  await page.waitForURL(/sales\/order\/index/);

  await waitForGridToStabilize(page);
  await clearFiltersIfPresent(page);

  /* ---------- Status-wise counts ---------- */
  for (const status of STATUSES) {
    console.log(`🔎 Fetching count for: ${status}`);

    await waitForGridToStabilize(page);

    // Open filter panel
    await openFilters(page);

    // Set date via JS
    await setDateFilters(page, pstDate);

    // Select status
    await page.selectOption(
      'select[name="status"]',
      { label: status }
    );

    // Apply filters
    await applyFilters(page);

    const count = await readSummaryCount(page);
    counts[status] = count;

    console.log(`📦 ${status}: ${count}`);
  }

  /* ---------- Total ---------- */
  const totalOrders = Object.values(counts)
    .reduce((a, b) => a + b, 0);

  console.log(`📦 Total Orders: ${totalOrders}`);

  return {
    date: pstDate,
    total: totalOrders,
    counts
  };
}
