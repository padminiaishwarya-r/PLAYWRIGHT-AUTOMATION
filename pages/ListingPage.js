import { getWebVitals } from '../utils/performanceMetrics.js';
import WebEngagePopup from "../utils/webengagePopup";   // ✅ IMPORTANT FIX
export default class ListingPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.productItem = page.locator('.product-item, li.product-item');
    this.productImage = page.locator(
      '.product-item-photo img, .product-image img, img[class*="product"], .product-item img'
    );
    this.productWishlistBtn = page.locator('[data-action="add-to-wishlist"]');
    this.sortBy = page.locator("label:has-text('Sort by')")
    this.sorter = page.locator("select[data-role='sorter']");
    this.sorterOptions = ["position", "rts", "price_asc", "price_desc"];
    this.sortDropdown = page.locator("div.toolbar-sorter"); 
    this.filterPanel = page.locator(".amshopby-filters-left");  // scroll container
    this.viewAllFiltersBtn = page.locator(".amshopby-show-button");  
    this.filterGroups = page.locator(".filter-options .filter-options-item");
    this.productItems = page.locator(".product-item");
    this.liveVideoCallBtn = page.getByRole('link', { name: 'Live Video Call' });

  }

  async openRandomProduct() {
    console.log("Waiting for product tiles to load in DOM…");
    await this.page.waitForSelector(".product-item", {
      state: "attached",
      timeout: 15000
    });
     const tiles = this.page.locator(".product-item");
    let visibleTile = null;
     console.log("Searching for first visible product tile…");
    for (let i = 0; i < 15; i++) {
      const count = await tiles.count();
       for (let j = 0; j < count; j++) {
        const tile = tiles.nth(j);
        if (await tile.isVisible()) {
          visibleTile = tile;
          console.log(`Found visible tile at index ${j}`);
          break;
        }
      }
       if (visibleTile) break;
      await this.page.mouse.wheel(0, 600);
      await this.page.waitForTimeout(400);
    }
     if (!visibleTile) {
      throw new Error("No visible product tiles found even after scrolling");
    }
    const allVisible = await tiles.filter({
      has: this.page.locator(":visible")
    }).all();
     const randomIndex = Math.floor(Math.random() * allVisible.length);
    const randomTile = allVisible[randomIndex];
     console.log(`Clicking visible product tile index: ${randomIndex}`);
    const productLink = randomTile.locator("a.product-item-link");
     await productLink.waitFor({
      state: "visible",
      timeout: 10000
    });
    const popup = new WebEngagePopup(this.page);
    await popup.closePopup();
     await productLink.click({ force: true });
     console.log("Waiting for product page…");
     await this.page.waitForLoadState("domcontentloaded");
     console.log("Product page opened!");
  }

  async clickRandomWishlist(){
    console.log("Waiting for product tiles to load in DOM…");
    await this.page.waitForSelector(".product-item", {
      state: "attached",
      timeout: 15000
    });
    const tiles = this.page.locator(".product-item");
    let visibleTile = null;
    console.log("🔍 Searching for first visible product tile…");
    for (let i = 0; i < 15; i++) {
      const count = await tiles.count();
      for (let j = 0; j < count; j++) {
        const tile = tiles.nth(j);
        if (await tile.isVisible()) {
          visibleTile = tile;
          console.log(`Found visible tile at index ${j}`);
          break;
        }
      }
      if (visibleTile) break;
      await this.page.mouse.wheel(0, 600);
      await this.page.waitForTimeout(400);
    }
    if (!visibleTile) {
      throw new Error("No visible product tiles found even after scrolling");
    }
    const allVisible = await tiles.filter({
      has: this.page.locator(":visible")
    }).all();
    const randomIndex = Math.floor(Math.random() * allVisible.length);
    const randomTile = allVisible[randomIndex];
    console.log(`Clicking visible product tile index: ${randomIndex}`);
    const productWishlist = randomTile.locator('[data-action="add-to-wishlist"]');
    await productWishlist.waitFor({
      state: "visible",
      timeout: 10000
    });
    await productWishlist.click({ force: true });
    console.log("Waiting for whether ");
  }
  
  async sortByRandom() {
    const sorterBlock = this.page.locator("div.toolbar-sorter").first();
    await sorterBlock.waitFor({ state: "visible" });
    await sorterBlock.click();
    const options = ["position", "rts", "price_asc", "price_desc"];
    const random = Math.floor(Math.random() * options.length);
    const value = options[random];
    console.log(`Sorting by: ${value}`);
    const visibleOption = this.page.locator(`li[data-value="${value}"]`);
    await visibleOption.waitFor({ state: "visible" });
    await visibleOption.click();
    await this.page.waitForTimeout(1500);
  }
  
  async applyRandomFilter() {
    try {
      console.log("Checking for visible filter blocks...");
      const sidebar = this.page.locator(".sidebar");
      await sidebar.waitFor({ state: "visible", timeout: 8000 });
      const filters = sidebar.locator(".filter-options-item").filter({ has: this.page.locator(".item") });
      const filterCount = await filters.count();
      if (filterCount === 0) {
        return { success: false, message: "No filter blocks found" };
      }
      const usableFilters = [];
      for (let i = 0; i < filterCount; i++) {
        const block = filters.nth(i);
        const title = block.locator(".filter-options-title");
        if (!(await title.isVisible())) continue;
        await title.click({ timeout: 3000 });
        const optionsContainer = block.locator(".filter-options-content .item");
        const optionCount = await optionsContainer.count();
        const visibleOptions = [];
        for (let j = 0; j < optionCount; j++) {
          const opt = optionsContainer.nth(j);
          if (await opt.isVisible()) visibleOptions.push(opt);
        }
        if (visibleOptions.length > 0) {
          usableFilters.push({ block, visibleOptions });
        }
      }
      if (usableFilters.length === 0) {
        return { success: false, message: "No visible sub-options found in any filter" };
      }
      const randomFilterIndex = Math.floor(Math.random() * usableFilters.length);
      const chosenFilter = usableFilters[randomFilterIndex];
      const options = chosenFilter.visibleOptions;
      const randomOptionIndex = Math.floor(Math.random() * options.length);
      const chosenOption = options[randomOptionIndex];
      const box = await chosenOption.boundingBox();
      if (box) {
        await this.page.evaluate((y) => window.scrollTo(0, y - 100), box.y); 
      }
      await chosenOption.click({ timeout: 8000 });
      await this.page.waitForLoadState("networkidle");
      return { success: true, message: "Random filter applied" };
    } catch (error) {
      return {
        success: false,
        message: "Random filter failed",
        error: error.message
      };
    }
  }
  
  async clickRandomLiveVideoCall() {
    console.log("Waiting for product tiles…");
    await this.page.waitForSelector(".product-item", { timeout: 15000 });  
    const tiles = this.page.locator(".product-item");
    console.log("Finding tiles that contain Live Video Call…");
    const liveVcTiles = tiles.filter({
      has: this.page.locator("text=Live Video Call")
    });
    const count = await liveVcTiles.count();
    console.log(`Found tiles with Live Video Call: ${count}`);
    if (count === 0) {
      throw new Error("No product tile contains Live Video Call");
    }
    const randomIndex = Math.floor(Math.random() * count);
    console.log(`Selecting tile index: ${randomIndex}`);
    const selectedTile = liveVcTiles.nth(randomIndex);
    const liveVcBtn = selectedTile.locator("text=Live Video Call");
    await liveVcBtn.scrollIntoViewIfNeeded();
    await liveVcBtn.waitFor({ state: "visible", timeout: 8000 });
    await liveVcBtn.click({ force: true });
    console.log("Clicked Live Video Call successfully!");
  }
  

  async captureWebVitals() {
    await this.page.waitForLoadState('domcontentloaded');
    return await getWebVitals(this.page);
  }
}
