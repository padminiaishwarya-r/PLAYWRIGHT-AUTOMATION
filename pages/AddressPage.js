import BasePage from './BasePage.js';
export default class AddressPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
  
    // ---------- SHIPPING LOCATORS (unchanged) ----------
    this.street = page.locator("#shipping-new-address-form input[name='street[0]']");
    this.apartment = page.locator("#shipping-new-address-form input[name='street[1]']");
    this.phone = page.locator("#shipping-new-address-form input[name='telephone']");
    this.continueToPaymentButton = page.getByRole("button", {
      name: /Continue to Payment Method/i
    });
  
    // ---------- BILLING SECTION ROOT (🔥 MUST COME FIRST) ----------
    this.billingSection = page.locator("text=Billing Address").locator("..");
  
    // ---------- BILLING CHECKBOXES ----------
    this.billingSameAsShippingCheckbox = page.locator(
      "#billing-address-same-as-shipping-shared"
    );

    this.saveInAddressBookCheckbox = page.locator(
      "#billing-save-in-address-book"
    );
    
  
    this.billingSameAsShippingLabel = page.locator(
      "label[for='billing-address-same-as-shipping-shared']"
    );
  
    
  
    // ---------- BILLING INPUTS (SCOPED) ----------
    this.billingFirstName = this.billingSection.locator(
      "input[name='firstname']"
    );
  
    this.billingLastName = this.billingSection.locator(
      "input[name='lastname']"
    );
  
    this.billingStreet = this.billingSection.locator(
      "input[name='street[0]']"
    );
  
    this.billingApartment = this.billingSection.locator(
      "input[name='street[1]']"
    );
  
    this.billingCity = this.billingSection.locator(
      "input[name='city']"
    );
  
    this.billingPostcode = this.billingSection.locator(
      "input[name='postcode']"
    );
  
    this.billingPhone = this.billingSection.locator(
      "input[name='telephone']"
    );
  }
  
  
 
  async fillStreetAddress(address) {
    const street = this.street;
  
    await street.fill("");
    await street.type(address, { delay: 120 });
  
    console.log("Waiting for Google suggestions…");
  
    // Wait for suggestions container
    await this.page.waitForSelector(".pac-item", { timeout: 15000 });
  
    // ⬇️ Select first suggestion via keyboard
    await street.press("ArrowDown");
    await street.press("Enter");
  
    console.log("Selected address using keyboard:", address);
  }
  
  
   async fillApartment(apt) {
      await this.apartment.waitFor({ state: "visible", timeout: 10000 });
      await this.apartment.fill(apt);
  }
 
  async fillPhone(phone) {
      await this.phone.waitFor({ state: "visible", timeout: 10000 });
      await this.phone.fill(phone);
  }
 
  async continueToPayment() {
    console.log("Clicking Continue to Payment Method");
    const button = this.continueToPaymentButton;
    await button.waitFor({
      state: "visible",
      timeout: 40000
    });
    await button.scrollIntoViewIfNeeded();
    await button.click({ force: true });
    console.log("Continue to Payment clicked");
  }
   
  async fillFullAddress({ street, apartment, phone }) {
    await this.fillStreetAddress(street);
    await this.fillApartment(apartment);
    await this.fillPhone(phone);
    console.log('Waiting for shipping + summary loaders...');
    await this.waitForShippingPageToBeReady();
    console.log('Clicking Continue to Payment');
  }
  
  async waitForShippingPageToBeReady(timeout = 40000) {
    await this.page
      .waitForSelector('.loading-mask', { state: 'visible', timeout: 5000 })
      .catch(() => {});
      await this.page.waitForFunction(() => {
      const loaders = document.querySelectorAll('.loading-mask');
      return [...loaders].every(loader => {
        const style = window.getComputedStyle(loader);
        return (
          style.display === 'none' ||
          style.visibility === 'hidden' ||
          style.opacity === '0'
        );
      });
    }, { timeout });
      await this.page.waitForFunction(() => {
      const summary = document.querySelector('.opc-sidebar');
      return summary && summary.innerText.trim().length > 0;
    }, { timeout });
      await this.page.waitForFunction(() => {
      const btn = [...document.querySelectorAll('button')]
        .find(b => /continue to payment/i.test(b.innerText));
      return btn && !btn.disabled;
    }, { timeout });
  }
  
  async openBillingAddressSection() {
    const checkbox = this.billingSameAsShippingCheckbox;
  
    if (!(await checkbox.count())) {
      console.log("ℹ️ Same as shipping checkbox not present");
      return;
    }
  
    if (await checkbox.isChecked()) {
      console.log("Unchecking 'Same as shipping address'");
      await this.billingSameAsShippingLabel.click({ force: true });
    }
  
    // ✅ Wait for billing section's first input
    await this.billingFirstName.waitFor({
      state: "visible",
      timeout: 15000
    });
  
    console.log("✅ Billing address section ready");
  }
  
  
  
  
  async disableSaveInAddressBook() {
    const checkbox = this.saveInAddressBookCheckbox;
  
    // 🔒 Safety guard
    if (!checkbox) {
      console.log("⚠️ saveInAddressBookCheckbox locator not defined");
      return;
    }
    
  
    // Checkbox may be hidden for logged-in users
    if ((await checkbox.count()) === 0) {
      
      console.log("ℹ️ Save in address book checkbox not present");
      return;
    }
  
    // It is hidden input → click via JS/force
    if (await checkbox.isChecked()) {
      console.log("Unchecking 'Save in address book'");
      await checkbox.evaluate(el => el.click());
    }
  }
  
  

  async fillBillingStreetAddress(address) {
    const street = this.billingStreet;
  
    await street.waitFor({ state: "visible", timeout: 15000 });
  
    // Clear + type
    await street.fill("");
    await street.pressSequentially(address, { delay: 120 });
  
    console.log("⌛ Waiting for Google Places suggestions…");
  
    // ✅ Wait until at least ONE visible pac-item exists
    await this.page.waitForFunction(() => {
      const items = document.querySelectorAll(".pac-item");
      return [...items].some(item => {
        const rect = item.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
    }, { timeout: 15000 });
  
    // ✅ Keyboard select (MOST STABLE)
    await street.press("ArrowDown");
    await street.press("Enter");
  
    console.log("✅ Billing address selected via keyboard");
  }
  
  

  async fillBillingApartment(apartment) {
    await this.billingApartment.waitFor({ state: "visible", timeout: 10000 });
    await this.billingApartment.fill(apartment);
  }
  
  async fillBillingPhone(phone) {
    await this.billingPhone.waitFor({ state: "visible", timeout: 10000 });
    await this.billingPhone.fill(phone);
  }
  
  async fillFullBillingAddress({ street, apartment, phone }) {
    await this.openBillingAddressSection();
    await this.fillBillingStreetAddress(street);
    await this.fillBillingApartment(apartment);
    await this.fillBillingPhone(phone);
  
    console.log("Waiting for billing loaders...");
    await this.waitForShippingPageToBeReady();
  }

  // ===============================
// Error Validation
// ===============================
async validateRequiredFieldErrors() {
  // Only visible validation errors
  const visibleErrors = this.page.locator(
    ".field-error:not(.no-display), .mage-error:not(.no-display)"
  );

  // Wait until at least ONE visible error appears
  await this.page.waitForFunction(() => {
    const errors = document.querySelectorAll(
      ".field-error:not(.no-display), .mage-error:not(.no-display)"
    );
    return errors.length > 0;
  }, { timeout: 20000 });

  const count = await visibleErrors.count();
  console.log(`✅ Validation errors displayed: ${count}`);

  if (count === 0) {
    throw new Error("Expected validation errors but none found");
  }
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
 
 

 