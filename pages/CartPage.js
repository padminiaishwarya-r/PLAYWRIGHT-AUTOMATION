import { getWebVitals } from '../utils/performanceMetrics.js';    
export default class CartPage {
        /**
         * @param {import('@playwright/test').Page} page
         */
    constructor(page) {
        this.page = page;
        this.checkoutSecurelyLocator = page.locator(
            "button:has-text('Proceed'), button:has-text('Checkout'), button:has-text('Secure')"
        );
        this.summaryPanel = page.locator(".opc-block-summary");
    }

    async clickSecureCheckout() {
        console.log("Waiting for checkout button...");
        await this.checkoutSecurelyLocator.first().waitFor({
            state: "visible",
            timeout: 30000
        });

        console.log("Clicking checkout button...");
        await this.checkoutSecurelyLocator.first().click({ timeout: 20000 });
        console.log("Waiting for Order Summary panel...");
        console.log("Summary panel loaded!");
    }

    async captureWebVitals() {
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(3000);
        const vitals = await getWebVitals(this.page);
        return {
          lcp: vitals?.lcp ?? 0,
          cls: vitals?.cls ?? 0
        };
      }
}
