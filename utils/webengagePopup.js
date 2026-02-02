export default class WebEngagePopup {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async closePopup(timeout = 4000) {
    const start = Date.now();
    console.log("Checking for blocking popups...");

    while (Date.now() - start < timeout) {
      try {
        const iframes = this.page.locator("iframe");
        const count = await iframes.count();
        for (let i = 0; i < count; i++) {
          const frame = await iframes.nth(i).contentFrame();
          if (!frame) continue;
          const closeBtn = frame.locator(
            "button[aria-label='Close'], button:has-text('×'), .close, .we_close, i[class*='close']"
          );
          if (await closeBtn.first().isVisible().catch(() => false)) {
            console.log("Closing iframe popup");
            await closeBtn.first().click({ force: true });
            await this.page.waitForTimeout(300);
            return;
          }
        }
        // Try top-level modal close buttons
        const pageCloseBtn = this.page.locator(
          "button[aria-label='Close'], button:has-text('×'), .modal-close, .close"
        );
        if (await pageCloseBtn.first().isVisible().catch(() => false)) {
          console.log("Closing top-level popup");
          await pageCloseBtn.first().click({ force: true });
          await this.page.waitForTimeout(300);
          return;
        }
        //  Nothing found yet — wait a bit
        await this.page.waitForTimeout(300);
      } catch (e) {
        // Ignore navigation/frame detach errors
      }
    }

    console.log(" No popup detected (safe to continue)");
  }
}
