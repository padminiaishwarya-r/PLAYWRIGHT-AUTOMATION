import { test, expect } from '@playwright/test';
import SignupPage from '../../pages/SignUpPage.js';
import HomePage from '../../pages/HomePage';
import WebEngagePopup from '../../utils/webengagePopup.js';
import { signUpTestData } from '../../test-data/signUpData.js';

  test.describe('Signup Functionality – All Validations', () => {
    test.beforeEach(async ({ page }) => {
      const home = new HomePage(page);
      const webEngage = new WebEngagePopup(page);
      await page.goto('/', {
      waitUntil: 'domcontentloaded'
    });
      await home.acceptCookies();
      await webEngage.closePopup();
      await home.openSignup(); 
  });

    test('TC_01 Signup with valid details', async ({ page }) => {
      const signup = new SignupPage(page);
      const data = signUpTestData.valid;
      await signup.signup(
        data.firstname,
        data.lastname,
        data.email,
        data.mobile,
        data.password,
        data.confirmpassword
      );
    });

  // EMPTY FIRST NAME
  test('TC_02 Signup with empty firstname', async ({ page }) => {
    const signup = new SignupPage(page);
    const data = signUpTestData.emptyFirstname;
    await signup.signup(
      data.firstname,
      data.lastname,
      data.email,
      data.mobile,
      data.password,
      data.confirmpassword
    );
    await expect(signup.firstNameError).toBeVisible();
  });

  // EMPTY LAST NAME
  test('TC_03 Signup with empty lastname', async ({ page }) => {
    const signup = new SignupPage(page);
    const data = signUpTestData.emptyLastname;
    await signup.signup(
      data.firstname,
      data.lastname,
      data.email,
      data.mobile,
      data.password,
      data.confirmpassword
    );
    await expect(
      page.getByText(data.error)
    ).toBeVisible();
  });

  // INVALID MOBILE NUMBER
  test('TC_04 Signup with invalid mobile number', async ({ page }) => {
    const signup = new SignupPage(page);
    const data = signUpTestData.invalidMobile;
    await signup.signup(
      data.firstname,
      data.lastname,
      data.email,
      data.mobile,
      data.password,
      data.confirmpassword
    );
    await expect(
      page.getByText(data.error)
    ).toBeVisible();
  });

  // WEAK PASSWORD
  test('TC_05 Signup with weak password', async ({ page }) => {
    const signup = new SignupPage(page);
    const data = signUpTestData.weakPassword;
    await signup.signup(
      data.firstname,
      data.lastname,
      data.email,
      data.mobile,
      data.password,
      data.confirmpassword
    );
    const toast = await signup.waitForWeakPasswordToast();
    await expect(toast)
      .toContainText('at least 8 characters');
    });
  
  // PASSWORD & CONFIRM PASSWORD MISMATCH
  test('TC_06 Signup with password mismatch', async ({ page }) => {
    const signup = new SignupPage(page);
    const data = signUpTestData.passwordMismatch;
    await signup.signup(
      data.firstname,
      data.lastname,
      data.email,
      data.mobile,
      data.password,
      data.confirmpassword
    );
    await expect(
      page.getByText(data.error)
    ).toBeVisible();
  });

});
