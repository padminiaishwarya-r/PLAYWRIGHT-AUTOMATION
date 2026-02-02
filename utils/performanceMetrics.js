export async function getWebVitals(page) {
  try {
    if (page.isClosed()) {
      console.warn('⚠️ Page already closed. Skipping vitals.');
      return defaultVitals();
    }

    await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
    await page.waitForTimeout(1500);

    const vitals = await page.evaluate(() => {
      return new Promise(resolve => {
        let cls = 0;
        let lcp = 0;

        try {
          new PerformanceObserver(list => {
            for (const entry of list.getEntries()) {
              cls += entry.value;
            }
          }).observe({ type: 'layout-shift', buffered: true });

          new PerformanceObserver(list => {
            const entries = list.getEntries();
            if (entries.length) {
              lcp = entries[entries.length - 1].startTime;
            }
          }).observe({ type: 'largest-contentful-paint', buffered: true });

          setTimeout(() => resolve({ cls, lcp }), 4000);
        } catch {
          resolve({ cls: 0, lcp: 0 });
        }
      });
    });

    return {
      cls: Number(vitals.cls.toFixed(2)),
      lcp: Math.round(vitals.lcp),
      clsStatus: vitals.cls <= 1.5 ? 'PASS' : 'FAIL',
      lcpStatus: vitals.lcp <= 15000 ? 'PASS' : 'FAIL'
    };

  } catch (error) {
    console.warn('⚠️ Web Vitals capture failed:', error.message);
    return defaultVitals();
  }
}

function defaultVitals() {
  return {
    cls: 'NA',
    lcp: 'NA',
    clsStatus: 'NA',
    lcpStatus: 'NA'
  };
}
