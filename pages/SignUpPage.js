import { expect } from "@playwright/test";   // ✅ IMPORTANT FIX
export default class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.signupEmail = page.locator('#registration-email');
    this.signupPassword = page.locator('input[name="password"]');
    this.signupConfirmPwd = page.locator('#confirmpassword');
    this.mobile = page.locator('#popupmobile');
    this.firstname = page.locator('#firstname');
    this.lastname = page.locator('#lastname');
    this.signupButton = page.getByRole("button", { name: "Signup" });
    this.firstNameError = page.locator('#firstname + .mage-error');
    this.passwordError = page
    .locator('input[name="password"]')
    .locator('..')
    .locator('.mage-error');
    this.toastError = page.locator(
        'div',
        { hasText: 'THE PASSWORD NEEDS AT LEAST 8 CHARACTERS' }
      );
      
  
  }

  async signup(firstname, lastname, email, mobile, password, confirmpassword) {
    await this.firstname.fill(firstname);
    await this.lastname.fill(lastname);
    await this.signupEmail.fill(email);
    await this.mobile.fill(mobile);
    await this.signupPassword.fill(password);
    // 🔥 FORCE password validation
    await this.signupPassword.blur();
    await this.signupConfirmPwd.fill(confirmpassword);
    await this.signupButton.click();
  }
  
  async waitForWeakPasswordToast() {
    const errorToast = this.page.locator(
      'div[data-ui-id="message-error"]',
      { hasText: 'password needs at least 8' }
    );
  
    await errorToast.waitFor({
      state: 'visible',
      timeout: 10000
    });
  
    return errorToast;
  }
  
  
}