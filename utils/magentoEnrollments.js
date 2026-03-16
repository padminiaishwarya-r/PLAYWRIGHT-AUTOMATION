import { expect } from '@playwright/test';

export async function getMagentoEnrollments(page) {
  console.log("🚀 Navigating directly using href...");

  // ✅ Direct URL navigation (stable)
  const enrollmentLink = await page.locator('a[href*="goldscheme/enrollment"]').first();
  const href = await enrollmentLink.getAttribute('href');

  await page.goto(href, { waitUntil: 'networkidle' });

  console.log("Enrollment URL:", page.url());

  await waitForGridToStabilize(page);

  // 🔥 CLEAR FILTERS
  await clearGridFiltersIfAny(page);

  // 🔥 APPLY FILTERS
  await applyFilters(page);

  await waitForGridToStabilize(page);
  await tryIncreasePageSize(page);
  await scrollGridFooterIntoView(page);

  const totalRecords = await parseTotalRecords(page);
  const PAGE_SIZE = 20;
  const maxPages = totalRecords ? Math.ceil(totalRecords / PAGE_SIZE) : 20;
  console.log(`📊 Total records: ${totalRecords || '?'}, max pages: ${maxPages}`);

  const enrollments = [];
  let currentPage = 1;
  let hasMore = true;
  let firstPlanIdOnPage1 = null;

  while (hasMore) {
    await waitForGridToStabilize(page);

    const rows = page.locator('tbody tr.data-row');
    const rowCount = await rows.count();
    console.log(`📄 Page ${currentPage}: ${rowCount} rows`);

    for (let i = 0; i < rowCount; i++) {
      const cells = rows.nth(i).locator('td');
      const planId = (await cells.nth(2).innerText()).trim();
      if (currentPage === 1 && i === 0) firstPlanIdOnPage1 = planId;
      const cellCount = await cells.count();
      let subscriptionId = '';
      for (const idx of [19, 22, 20]) {
        if (idx >= cellCount) continue;
        const v = (await cells.nth(idx).innerText({ timeout: 2000 }).catch(() => '')).trim();
        if (/^sub_/.test(v)) { subscriptionId = v; break; }
      }
      const installmentsPaidText = (await cells.nth(cellCount > 7 ? 7 : 6).innerText()).trim();
      enrollments.push({ planId, subscriptionId, installmentsPaid: Number(installmentsPaidText || 0) });
    }

    if (rowCount < PAGE_SIZE || currentPage >= maxPages) {
      hasMore = false;
      console.log("✅ Reached last page.");
      break;
    }

    await page.waitForTimeout(300);
    await scrollGridFooterIntoView(page);

    const nextClicked = await clickPagerNext(page);
    if (nextClicked) {
      currentPage++;
      console.log("➡️ Next page (pager click)");
    } else {
      const firstPlanIdNow = await rows.nth(0).locator('td').nth(2).innerText().catch(() => '');
      if (firstPlanIdOnPage1 && firstPlanIdNow.trim() === firstPlanIdOnPage1) {
        console.log("✅ Reached last page (pager not available, same data).");
        hasMore = false;
      } else {
        hasMore = false;
        console.log("✅ Stopping (no Next button, cap at page " + currentPage + ").");
      }
    }
  }

  console.log(`✅ Total enrollments collected: ${enrollments.length}`);

  return enrollments;
}

/** Parse "214 records found" to get total count. */
async function parseTotalRecords(page) {
  try {
    const text = await page.getByText(/\d+\s*records?\s*found/i).first().textContent({ timeout: 3000 });
    const m = text && text.match(/(\d+)\s*records?\s*found/i);
    return m ? parseInt(m[1], 10) : null;
  } catch {
    return null;
  }
}

/** Click the pager's Next (>) so the grid loads the next page via AJAX. Returns true if clicked. */
async function clickPagerNext(page) {
  await scrollGridFooterIntoView(page);
  const wrap = page.locator('.admin__data-grid-wrap').first();
  const nextSelectors = [
    'a.action-next:not(.disabled)',
    'a[title="Next"]',
    '.admin__control-pagination a.action-next',
    '.admin__data-grid-pager-wrap a.action-next',
  ];
  for (const sel of nextSelectors) {
    const btn = wrap.locator(sel).first();
    try {
      if (await btn.isVisible({ timeout: 1500 })) {
        const disabled = await btn.evaluate((el) => el.classList.contains('disabled') || el.closest('.disabled')).catch(() => true);
        if (!disabled) {
          await btn.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
          await btn.click({ force: true });
          return true;
        }
      }
    } catch {
      // next selector
    }
  }
  const clicked = await page.evaluate(() => {
    const wrap = document.querySelector('.admin__data-grid-wrap');
    if (!wrap) return false;
    const next = wrap.querySelector('a.action-next:not(.disabled), a[title="Next"]');
    if (next && !next.classList.contains('disabled')) {
      next.click();
      return true;
    }
    const links = wrap.querySelectorAll('.admin__control-pagination a, [class*="pager"] a');
    for (const a of links) {
      if (a.classList.contains('disabled')) continue;
      if (a.getAttribute('title') === 'Next' || (a.textContent || '').trim() === '>' || a.classList.contains('action-next')) {
        a.click();
        return true;
      }
    }
    return false;
  });
  return !!clicked;
}

/** Scroll grid footer/pager into view (pager may be below the fold). */
async function scrollGridFooterIntoView(page) {
  try {
    const footer = page.locator('.admin__data-grid-wrap .admin__data-grid-pager-wrap, .admin__data-grid-wrap .admin__control-pagination, .admin__data-grid-wrap [class*="pager"]').first();
    await footer.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    await page.evaluate(() => {
      const wrap = document.querySelector('.admin__data-grid-wrap');
      if (wrap) wrap.scrollTop = wrap.scrollHeight;
    }).catch(() => {});
    await page.waitForTimeout(200);
  } catch (_) {
    // page may be closed (e.g. test timeout) or timeout
  }
}

/** Set "per page" to 100 or 200 so we get more rows even if Next is hidden. */
async function tryIncreasePageSize(page) {
  const wrap = page.locator('.admin__data-grid-wrap').first();
  const selectors = [
    'select[data-role="limiter"]',
    'select.admin__control-select',
    'select[name*="limit"]',
    'select[class*="limiter"]',
  ];
  for (const sel of selectors) {
    const sizeSelect = wrap.locator(sel).first();
    try {
      if (await sizeSelect.isVisible({ timeout: 1000 })) {
        const has100 = await sizeSelect.locator('option[value="100"]').count() > 0;
        const has200 = await sizeSelect.locator('option[value="200"]').count() > 0;
        if (has200) await sizeSelect.selectOption({ value: '200' });
        else if (has100) await sizeSelect.selectOption({ value: '100' });
        else await sizeSelect.selectOption({ value: '50' }).catch(() => {});
        await page.waitForTimeout(1500);
        await waitForGridToStabilize(page);
        console.log("📄 Increased page size (100/200/50)");
        return;
      }
    } catch {
      // next selector
    }
  }
}

async function waitForGridToStabilize(page) {
  const timeout = 15000;
  await page.waitForSelector('table.data-grid', { state: 'attached', timeout });
  const loader = page.locator('.admin__data-grid-loading-mask');
  await loader.waitFor({ state: 'hidden', timeout }).catch(() => {});
  await page.waitForTimeout(300);
  await page.waitForSelector('tbody tr.data-row, tbody tr', { state: 'attached', timeout: 8000 }).catch(() => {});
}

async function clearGridFiltersIfAny(page) {
  const clearBtn = page.locator('button[data-action="grid-filter-reset"]');

  if (await clearBtn.isVisible().catch(() => false)) {
    await clearBtn.click();
  }
}

async function applyFilters(page) {
  console.log("🔍 Applying filters: Status=Active, IsActive=1");

  await page.getByRole('button', { name: 'Filters' }).first().click();

  await page.fill('input[name="status"]', 'Active');
  await page.fill('input[name="is_active"]', '1');

  await page.locator('button[data-action="grid-filter-apply"]').click();

}