export default class BasePage {
    /**
   * @param {import('@playwright/test').Page} page
   */
    constructor(page) {
      this.page = page;
    }
  
    async waitForMagentoIdle() {
      await this.page.waitForFunction(() => {
        return (
          document.readyState === 'complete' &&
          !document.querySelector('.loading-mask')
        );
      }, { timeout: 30000 });
    }
  
    async waitForNetworkIdle() {
      await this.page.waitForLoadState('networkidle');
    }
  }
  