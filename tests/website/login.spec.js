import { test } from '@playwright/test';
import LoginPage from '../../pages/LoginPage';
import HomePage from '../../pages/HomePage';
import WebEngagePopup from '../../utils/webengagePopup.js';
import { loginTestData } from '../../test-data/loginData';

  test.describe('Login Functionality – All Validations', () => {
    test.beforeEach(async ({ page }) => {
      const home = new HomePage(page);
      const webEngage = new WebEngagePopup(page);
      await page.goto('https://www.caratlane.us', {
        waitUntil: 'domcontentloaded'
      });
      await home.acceptCookies();
      await webEngage.closePopup();
      await home.openLogin();
    });

    test('Valid login', async ({ page }) => {
      const login = new LoginPage(page);
      const home = new HomePage(page);
      const webEngage = new WebEngagePopup(page);
      await login.login(
      loginTestData.valid.email,
      loginTestData.valid.password
    );
      await webEngage.closePopup();
      await home.isStoreLogoVisible();
  });

  test('Invalid email', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login(
      loginTestData.invalidEmail.email,
      loginTestData.invalidEmail.password
    );
    await login.expectInvalidLoginError();
  });

  test('Invalid password', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login(
      loginTestData.invalidPassword.email,
      loginTestData.invalidPassword.password
    );
    await login.expectInvalidLoginError();
  });

  test('Empty email', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login(
      loginTestData.emptyEmail.email,
      loginTestData.emptyEmail.password
    );
    await login.expectRequiredFieldError();
  });

  test('Empty password', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login(
      loginTestData.emptyPassword.email,
      loginTestData.emptyPassword.password
    );
    await login.expectRequiredFieldError();
  });

  test('Empty email and password', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login(
      loginTestData.emptyBoth.email,
      loginTestData.emptyBoth.password
    );
    await login.expectRequiredFieldError();
  });

});
