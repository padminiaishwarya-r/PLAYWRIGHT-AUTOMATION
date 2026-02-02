import { getWebVitals } from '../utils/performanceMetrics.js';
export default class PaymentPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
      this.page = page;
      this.placeOrderBtn = page.getByRole("button", { name: "Place Order" });
  }

  async captureWebVitals() {
    await this.page.waitForLoadState('domcontentloaded');
    return await getWebVitals(this.page);
  }

  async clickPlaceOrder() {
    console.log('Waiting for Place Order to be clickable (no interception)...');
    const button = this.placeOrderBtn;
    await button.waitFor({ state: 'visible', timeout: 30000 });
    await button.scrollIntoViewIfNeeded();
    await this.page.waitForFunction(async () => {
      const btn = document.querySelector('button.action.primary.checkout');
      if (!btn) return false;
      const rect = btn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const elAtPoint = document.elementFromPoint(x, y);
      return elAtPoint === btn || btn.contains(elAtPoint);
    }, { timeout: 40000 });
      await button.click();
    console.log('Place Order clicked successfully');
  }
    
}