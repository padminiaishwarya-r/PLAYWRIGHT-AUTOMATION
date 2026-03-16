// utils/magentoWaits.js

export async function waitForGridToStabilize(page) {
    const spinnerSelector =
      'div[data-role="spinner"].admin__data-grid-loading-mask';
  
    await page.waitForFunction(
      (selector) => {
        const spinner = document.querySelector(selector);
  
        if (!spinner) return true;
  
        const style = window.getComputedStyle(spinner);
  
        return (
          style.display === 'none' ||
          style.visibility === 'hidden' ||
          style.opacity === '0'
        );
      },
      spinnerSelector,
      { timeout: 30000 }
    );
  
    // Small buffer for layout stabilization
    await page.waitForTimeout(500);
  }
  