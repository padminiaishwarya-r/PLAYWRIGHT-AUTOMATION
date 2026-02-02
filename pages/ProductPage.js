import { getWebVitals } from '../utils/performanceMetrics.js';
import { expect } from "@playwright/test";
import WebEngagePopup from "../utils/webengagePopup";   // ✅ IMPORTANT FIX
export default class ProductPage {
    /**
      * @param {import('@playwright/test').Page} page
    */

  constructor(page) {
    this.page = page;
    this.pdpContainer = page.locator("div.product-page, #pdp-container");
    this.addToACartBtn = page.locator("button:has-text('Add to Cart'), #addToCartButton");
    this.wishlistBtn = page.locator('[data-action="add-to-wishlist"]');
    this.loader = page.locator(".loader, .loading-mask");
    this.miniCartButton = page.locator('.action.showcart');
    this.similarAgainstProduct = page.locator("//span[contains(@class, 'see-similar-icon')]");
    this.recommendedTitle = page.locator(".recommendation-title");
    this.similarTab = page.getByText("Similar", { exact: true });
    this.similarProducts = page.locator("div.product-item-info");
    this.trendingProducts = page.locator("#trendingPdpTab .product-item-info");
    this.trendingTab = page.locator("li.tab-link[data-tab='trendingPdpTab']");
    this.activeTrendingTab = page.locator("li.tab-link.active[data-tab='trendingPdpTab']");
    this.addToCartBtn = page.locator("button#product-addtocart-button, button:has-text('Add to Cart')");
    this.customiseNowBtn = page.locator("div.customise_now");
    this.sizeOptions = page.locator("//div[contains(@class,'swatch_block_sizes')]//div[contains(@class,'swatch-option')]");
    this.metalOptions = page.locator("//div[contains(@class,'swatch_block_metal')]//div[contains(@class,'swatches')]/div");
    this.diamondOptions = page.locator("//div[contains(@class,'swatch_block_diamond')]//div[contains(@class,'swatches')]/div");
    this.currentMetalTitle = page.locator("//div[contains(@class,'swatch_block_metal')]//div[contains(@class,'swatches')]//span[@class='title']");
    this.currentDiamondTitle = page.locator("//div[contains(@class,'swatch_block_diamond')]//div[contains(@class,'swatches')]//span[@class='title']");
    this.confirmCustomizationBtn = page.locator("//div[@class='variationshowall-confim-btn']");
    this.smallBanner = page.locator('a.pop-link');
    this.modal = page.getByRole('dialog').filter({ hasText: 'Jewelry Saving Plan' });
    this.closeButton = this.modal.locator('button.action-close[data-role="closeBtn"]');  
    this.installmentItems = this.modal.locator('.installment-item');
    this.installmentInputs = this.modal.locator('input[type="radio"][name="installment"]');
    this.startYourPlanBtn = this.modal.locator('button.start-your-plan');
    this.knowMoreLink = this.modal.locator('a.know-more');
    };

  async closeBlockers() {
    const popupSelectors = ['.modal-popup', '.ui-dialog', '.mage-dropdown-dialog','.popup-authentication', '[data-role="close"]'];
    for (const sel of popupSelectors) {
      const el = this.page.locator(sel);
      if (await el.isVisible().catch(() => false)) {
        await el.locator('button, .close, .action-close').first().click({ force: true }).catch(() => {});
      }
    }
    await this.page.evaluate(() => {
      document.querySelectorAll('.ui-dialog, .modal-popup').forEach(el => el.remove());
    });
    await this.page.waitForTimeout(300);
  }

  async waitForPDP() {
    console.log("Waiting for PDP to load...");
    try {
      await this.page.waitForLoadState("networkidle", { timeout: 8000 });
    } catch {
      console.warn("Page not fully idle, continuing...");
    } try {
      await this.pdpContainer.first().waitFor({ timeout: 6000 });
      console.log("PDP container detected");
    } catch {
      console.warn("PDP not confirmed, continuing...");
    }
  }

  async addToACart() {
    await this.waitForPDP();
    console.log("Attempting Add to Cart...");
    if (await this.loader.count()) {
      try {
        await this.loader.first().waitFor({ state: "hidden", timeout: 8000 });
      } catch {
        console.warn("Loader still visible, continuing...");
      }
    }
    const addBtn = this.addToCartBtn.first();
    await addBtn.scrollIntoViewIfNeeded();
    console.log("visible:", await addBtn.isVisible());
    console.log("enabled:", await addBtn.isEnabled());
    try {
      await addBtn.click({ timeout: 4000 });
      console.log("Add to Cart clicked!");
    } catch {
      console.log("Normal click failed → retrying force click");
      await addBtn.click({ force: true });
      console.log("Add to Cart forced!");
    }
    await this.page.waitForTimeout(400);
  }

  async addToWishlist() {
    const button = this.page.locator('#view-page-wishlist');
    await button.waitFor({ state: 'visible', timeout: 8000 });
    await this.page.waitForTimeout(500);
    const isAlreadySaved = await button.evaluate((el) => {
    return el.classList.contains('icon-saved');
  });
    console.log("Detected saved state:", isAlreadySaved);
      if (isAlreadySaved) {
        console.log("Product already in wishlist — doing nothing.");
        return;
      }
    console.log("Adding product to wishlist...");
      await button.click();
      try {
        await this.page.waitForSelector('.message-success, .toast-message, .messages .success',{ timeout: 6000 });
    console.log("Success message appeared");
      } catch (e) {
    console.log("Success message did NOT appear (optional)");
    }
  }
    
  async proceedToCheckout() {
      await this.closeBlockers();
    console.log("Opening mini-cart…");
      try {
        await this.miniCartButton.click();
      } catch {
        await this.closeBlockers();
        await this.miniCartButton.click({ force: true });
      }
    const drawer = this.page.locator('.block-minicart');
      try {
        await drawer.waitFor({ state: "visible", timeout: 6000 });
    console.log("Mini-cart opened!");
        const viewCart = this.page.locator('#viewCartbtn');
        await viewCart.waitFor({ state: "visible", timeout: 6000 });
        await viewCart.click({ force: true });
      } catch {
    console.log("Mini-cart failed, going directly to cart page");
        await this.page.goto("https://www.caratlane.us/checkout/cart/");
    }
      await this.page.waitForLoadState("domcontentloaded");
  }

  async verifyShareFunctionality() {
    console.log("Clicking Share icon…");
    const triggers = [
      "input[value='Share']",
      "button[title='Share']",
      ".share-trigger",
      "#shareBtn"
    ];
    let clicked = false;
    for (const sel of triggers) {
    const el = this.page.locator(sel);
    if (await el.count() && await el.first().isVisible().catch(() => false)) {
      await el.first().click({ force: true }).catch(() => {});
      clicked = true;
      break;
    }
  }
    if (!clicked) {
    throw new Error("Share trigger not found");
  }
    const containerSelectors = [
      "#navList",
      ".share-media-wrapper",
      ".share",
      "div[id^='webklipper']" 
    ];
    let containerFound = false;
    for (const cs of containerSelectors) {
    try {
      await this.page.waitForSelector(cs, { timeout: 6000 });
      containerFound = true;
      break;
    } catch (e) {
    }
  }
    if (!containerFound) {
      console.warn("Share popup container not detected - continuing to check for list items anyway");
    }
    const listSelectors = [
      "ul.list-group li",
      ".share ul li",
      ".share-media-wrapper ul li",
      "#navList ul li"
    ];
    let itemsLocator = null;
    for (const ls of listSelectors) {
      const l = this.page.locator(ls);
      const present = await l.count().catch(() => 0);
      if (present > 0) {
      itemsLocator = l;
      break;
    }
  }
    if (!itemsLocator) {
      await this.page.waitForFunction(() => {
      return !!document.querySelector("ul.list-group li, .share ul li, .share-media-wrapper ul li, #navList ul li");
    }, { timeout: 8000 }).catch(() => {});
      for (const ls of listSelectors) {
      const l = this.page.locator(ls);
        if (await l.count().catch(() => 0) > 0) {
          itemsLocator = l;
          break;
        }
      }
    }
    if (!itemsLocator) {
      console.warn("No share options found after waiting");
      return [];
    }
    const count = await itemsLocator.count();
    console.log(`Found ${count} share option(s). Printing titles and hrefs:`);
    const options = [];
      for (let i = 0; i < count; i++) {
        const li = itemsLocator.nth(i);
        const anchor = li.locator("a, button");
        let title = "";
        let href = "";
        if (await anchor.count()) {
          title = (await anchor.first().getAttribute("title")) || (await anchor.first().innerText()).trim();
          href = (await anchor.first().getAttribute("href")) || "";
        } else {
          title = (await li.innerText()).trim();
          href = "";
        }
      title = title.replace(/\s+/g, " ").slice(0, 200);
      console.log(` ${i + 1}. "${title}"`);
      options.push({ title, href });
      }
    return options;
  }

  async clickSimilarItems() {
    await this.similarAgainstProduct.click({ timeout: 4000 });
    await expect(this.recommendedTitle).toBeVisible();
    const isTabVisible = await this.similarTab.isVisible();
      if (isTabVisible) {
        await this.similarProducts.first().waitFor({ state: "visible", timeout: 15000 });
        const count = await this.similarProducts.count();
        console.log("Total similar products found:", count);
        if (count === 0) {
          throw new Error("No similar products found!");
        }
        const randomIndex = Math.floor(Math.random() * count);
        const product = this.similarProducts.nth(randomIndex);
        console.log(`Clicking similar product #${randomIndex + 1}`);
        await product.scrollIntoViewIfNeeded();
        await product.click({ force: true });
        console.log("Similar product clicked successfully!");
      } else {
        console.log("Similar tab is NOT visible");
    }
  }
  
  async clickTrendingItems() {
    await this.similarAgainstProduct.click({ timeout: 4000 });
    await expect(this.recommendedTitle).toBeVisible({ timeout: 20000 });
    console.log("Checking if Trending tab exists...");
    const hasTrending = await this.trendingTab.isVisible({ timeout: 20000 });
    await this.trendingTab.click({ timeout: 30000 });
      if (hasTrending) {
      const count = await this.trendingProducts.count();
      console.log("Total trending products found:", count);
      if (count === 0) {
        throw new Error("No trending products found!");
      }
      const randomIndex = Math.floor(Math.random() * count);
      const product = this.trendingProducts.nth(randomIndex);
      console.log(`Clicking trending product #${randomIndex + 1}`);
      await product.scrollIntoViewIfNeeded();
      await product.click({ force: true });
      console.log("trending product clicked successfully!");
    } else {
      console.log("trending tab is NOT visible");
    } 
  }

  async addToCart() {
    const btn = this.addToCartBtn;
    await btn.waitFor({
      state: "visible",
      timeout: 5000
    }).catch(() => {}); 
    await this.page.waitForTimeout(800);
    const text = (await btn.innerText()).trim();
    const isDisabled = await btn.isDisabled();
    console.log("CTA text:", text);
    console.log("CTA disabled:", isDisabled);
    if (isDisabled || /out of stock/i.test(text)) {
      console.log("Product is OUT OF STOCK — test considered PASS.");
      return { outOfStock: true };
    }
    await btn.click();
    return { outOfStock: false };
  }

  async extractPdpDetails() {
    const page = this.page;
    const clean = (t) => t ? t.trim().replace(/\s+/g, " ") : "NA";
    const getSelectedSwatch = async (sectionClass) => {
    try {
      const section = page.locator(sectionClass);
      if (await section.count() === 0) return "NA";
      const selected = section.locator(
        ".selected, .active, [aria-checked='true'], [data-selected='true']"
      );
      if (await selected.count() > 0) {
        const text = await selected.first().innerText();
        return clean(text);
      }
        return "NA";
      } catch {
        return "NA";
      }
    };
      const productName = clean(
      await page.locator("h1.product-name, h1.page-title").textContent()
    );
      const variant = clean(
      await page.locator("span.productCategoryTag").textContent().catch(() => "NA")
    );
      const size = await getSelectedSwatch(".show_swatches_options_size");
      const diamond = await getSelectedSwatch(".show_swatches_options_diamond");
      const metal = await getSelectedSwatch(".show_swatches_options_metal");
      const expectedDelivery = clean(
        await page.locator("span.date").textContent().catch(() => "NA")
      );
      const result = {
        productName,
        variant,
        size,
        diamond,
        metal,
        expectedDelivery
      };  
      console.log("PDP Details:", result);
    return result;
  }

  async safeClick(locator) {
    try {
      await locator.waitFor({ state: "visible", timeout: 5000 });
      await locator.click({ timeout: 5000 });
    } catch (err) {
      console.log("Normal click failed, trying JS click");
      const el = await locator.elementHandle().catch(() => null);
    if (el) await this.page.evaluate(el => el.click(), el);
    }
  }

  async clickCustomizeNow() {
    await this.page.waitForTimeout(500);
    const popup = new WebEngagePopup(this.page);

  await popup.closePopup();
    if (!(await this.customiseNowBtn.isVisible())) {
      console.log("Customize Now not visible");
      return false;
    }
    console.log("Customize Now visible → clicking");
    await this.safeClick(this.customiseNowBtn);
    await this.page.waitForSelector("//h4[contains(., 'Select')]", { timeout: 8000 });
    console.log("Customisation modal opened");
    return true;
  }

  async customiseAndValidate() {
    await this.page.waitForTimeout(10000);
    const opened = await this.clickCustomizeNow();
    if (!opened) return;
    console.log("Modal opened");
    let selectedSize = "";
    let selectedMetal = "";
    let selectedDiamond = "";
    const sizeCount = await this.sizeOptions.count().catch(() => 0);
    if (sizeCount > 0) {
        const r = Math.floor(Math.random() * sizeCount);
        const el = this.sizeOptions.nth(r);
        await el.scrollIntoViewIfNeeded().catch(() => {});
        await expect(el).toBeVisible({ timeout: 5000 });
        await this.safeClick(el);
        await this.page.waitForTimeout(300);
      selectedSize = (await this.designSize.textContent().catch(() => ""))?.trim() || "";
      console.log("Selected Size →", selectedSize);
    } else {
      console.log("No sizes available.");
      selectedSize = "NA";
    }
    const metalCount = await this.metalOptions.count();
    if (metalCount > 0) {
      const r = Math.floor(Math.random() * metalCount);
      const el = this.metalOptions.nth(r);
      await this.safeClick(el);
      await this.page.waitForTimeout(400);
      selectedMetal = (await this.currentMetalTitle.first().textContent()).trim();
      console.log("✔ Selected Metal →", selectedMetal);
    }
    const diamondCount = await this.diamondOptions.count().catch(() => 0);
    if (diamondCount > 0) {
      const r = Math.floor(Math.random() * diamondCount);
      const el = this.diamondOptions.nth(r);
      await this.safeClick(el);
      await this.page.waitForTimeout(400);
    selectedDiamond =
      (await this.currentDiamondTitle.first().textContent().catch(() => ""))?.trim() || "";
      console.log("Selected Diamond →", selectedDiamond);
    } else {
      console.log("No Diamond Quality option available on product.");
      selectedDiamond = "NA";
    }
    await this.safeClick(this.confirmCustomizationBtn);
    console.log("🟢 Clicked Confirm Customisation");
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(1500);
    return { selectedSize, selectedMetal, selectedDiamond };
  }

  async openMiniPopup() {
    if (await this.smallBanner.isVisible({ timeout: 3000 })) {
    await this.smallBanner.click();
    await this.modal.waitFor({ state: 'visible', timeout: 5000 });
    console.log('Mini POP opened');
    }
  }

  async closePopPopup() {
    if (await this.modal.isVisible({ timeout: 3000 })) {
    await this.closeButton.click();
    await this.modal.waitFor({ state: 'hidden', timeout: 5000 });
    console.log('POP modal closed');
    }
  }

  async waitForPopup() {
    await this.popPlanModal.waitFor({ state: 'visible', timeout: 5000 });
  }

  async selectRandomPriceAndStartPlan() {
    await this.modal.waitFor({ state: 'visible', timeout: 5000 });
    const count = await this.installmentItems.count();
    if (count === 0) {
      throw new Error('No installment price options found');
    }
    const randomIndex = Math.floor(Math.random() * count);
    const selectedItem = this.installmentItems.nth(randomIndex);
    await selectedItem.scrollIntoViewIfNeeded();
    await selectedItem.click();
    const value = await this.installmentInputs
    .nth(randomIndex)
    .getAttribute('value');
    console.log(`Selected installment value: $${value}`);
    await this.startYourPlanBtn.click();
  }

  async clickKnowMore() {
    await this.modal.waitFor({ state: 'visible', timeout: 5000 });
    await this.knowMoreLink.click();
    console.log('Clicked KNOW MORE');
  }

  async captureWebVitals() {
    await this.page.waitForLoadState('domcontentloaded');
    return await getWebVitals(this.page);
  }
}



