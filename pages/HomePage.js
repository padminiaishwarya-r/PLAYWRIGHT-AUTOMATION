import { getWebVitals } from '../utils/performanceMetrics.js';
import { expect } from "@playwright/test";   // ✅ IMPORTANT FIX
export default class HomePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.acceptCookiesBtn = page.getByRole("button", { name: "Accept All" });
    this.profileButton = page.locator(".userpro-button");
    this.loginLink = page.getByRole("link", { name: "Login" });
    this.signUpLink = page.getByRole("link", {name: "Sign Up"});
    this.ringsMenu = page.locator('a[data-creative="Rings"]');
    this.viewAllRings = page.locator('a[title="View All Rings"]');
    this.storeLogo = page.getByRole('link', { name: 'store logo' });
  }    

  async acceptCookies() {
    const cookies = this.acceptCookiesBtn;
        await this.page.waitForTimeout(5000);
    if (await cookies.isVisible().catch(() => false)) {
        await cookies.click();
    }
  }

  async openLogin() {
    console.log("Opening login...");
    await this.profileButton.hover({ trial: false });
    await this.loginLink.waitFor({ state: "visible", timeout: 6000 });
    await this.loginLink.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async goToRings() {
    console.log("Navigating to Rings…");
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(2000);
    const selectors = [
      'a[data-creative="Rings"]',
      '//a[contains(@href,"/rings") and contains(@class,"nav-item")]',
      '//a[contains(@href,"/rings")]',
    ];
    for (const sel of selectors) {
      const element = this.page.locator(sel);
      try {
        await element.first().waitFor({ timeout: 2000 });
        console.log(`Rings found: ${sel}`);  
        await this.page.evaluate(el => el.click(), await element.first().elementHandle());
        await this.page.waitForLoadState("networkidle");
        console.log("Rings page opened.");
        return;
      } catch (e) {
      }
    }
  
    await this.page.screenshot({
      path: 'test-results/rings-not-found.png',
      fullPage: true
    });
  
    throw new Error("Rings not found on page — screenshot captured.");
  }

  async isStoreLogoVisible() {
    await expect(this.storeLogo).toBeVisible();
    console.log("Logo Visible");
    
  }

  async openSignup(){
    console.log("Opening Signup...");
    await this.profileButton.hover({ trial: false });
    await this.signUpLink.waitFor({ state: "visible", timeout: 6000 });
    await this.signUpLink.click();
    await this.page.waitForLoadState("domcontentloaded");
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