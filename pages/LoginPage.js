import { expect } from "@playwright/test";
export default class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator("#login-email");
    this.passwordInput = page.locator('input[name="login[password]"]');
    this.loginButton = page.getByRole("button", { name: "Log In" });
    this.invalidLoginError = page.getByText(
      'Invalid login or password.',
      { exact: true }
    );
    this.loginForm = page.locator('form#login-form'); 
    this.signupEmail = page.locator('#registration-email');
    this.signupPassword = page.locator('input[name="password"]');
    this.signupConfirmPwd = page.locator('#confirmpassword');
    this.mobile = page.locator('#popupmobile');
    this.firstname = page.locator('#firstname');
    this.lastname = page.locator('#lastname');
    this.signupButton = page.getByRole("button", { name: "Signup" });
  }

  async expectInvalidLoginError() {
    await expect(this.invalidLoginError).toBeVisible();
  }

  async expectRequiredFieldError() {
    await expect(
      this.page.getByText('This is a required field.', { exact: true }).first()
    ).toBeVisible();
  }

  async login(email, password) {
    console.log("Logging in...");
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.waitFor({ state: "visible" });
    await this.loginButton.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async signup(firstname,lastname,email,mobile,password,confirmpassword){
    await this.firstname.fill(firstname);
    await this.lastname.fill(lastname);
    await this.signupEmail.fill(email);
    await this.mobile.fill(mobile);
    await this.signupPassword.fill(password);
    await this.signupConfirmPwd.fill(confirmpassword);
    await this.signupButton.waitFor({ state: "visible" });
    await this.signupButton.click();
    await this.page.waitForLoadState("domcontentloaded");
  }


}
