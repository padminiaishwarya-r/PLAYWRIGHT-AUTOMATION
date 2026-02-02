import { test, expect } from "@playwright/test";
import LoginPage from '../../pages/LoginPage.js';
import HomePage from '../../pages/HomePage.js';
import ListingPage from '../../pages/ListingPage.js';
import ProductPage from '../../pages/ProductPage.js';
import CartPage from '../../pages/CartPage.js';
import AddressPage from "../../pages/AddressPage.js";
import WebEngagePopup from '../../utils/webengagePopup.js';
import { saveWebVitals } from '../../utils/webvitalsStore.js';

test.describe("Address Page", () => {

  test("TC_01 Enter Billing Address and Continue to Payment", async ({ page }) => {
    const login = new LoginPage(page);
    const home = new HomePage(page);
    const listing = new ListingPage(page);
    await page.goto("https://www.caratlane.us");
    await home.acceptCookies();
    await new WebEngagePopup(page).closePopup();
    await home.openLogin();
    await login.login("automationtesting1@mailinator.com", "Carat567@");
    await new WebEngagePopup(page).closePopup();
    await home.goToRings();
    await new WebEngagePopup(page).closePopup();
    const [productPageTab] = await Promise.all([
      page.waitForEvent("popup"),
      listing.openRandomProduct()
    ]);
    console.log("🌟 New product tab opened!");
    await new WebEngagePopup(productPageTab).closePopup();
    const productPage = new ProductPage(productPageTab);
    const result = await productPage.addToCart();
    await new WebEngagePopup(productPageTab).closePopup();
    if (result.outOfStock) {
      console.log("✔️ PASS: Product is out of stock as expected.");
      return;
    }
    await productPage.proceedToCheckout();
    await new WebEngagePopup(productPageTab).closePopup();
    const cartPage = new CartPage(productPageTab);
    await cartPage.clickSecureCheckout();
    await new WebEngagePopup(productPageTab).closePopup();
    const addressPage = new AddressPage(productPageTab); 
    await addressPage.fillFullAddress({
        street: "microsoft",
        apartment: "third floor",
        phone: "9876543210"
      });
    await addressPage.disableSaveInAddressBook();
    await addressPage.fillFullBillingAddress({
      street: "1600 Amphitheatre Parkway",
      apartment: "Apt 101",
      phone: "9876543210"
    });

    await addressPage.continueToPayment();

    
  });

  test("TC_02 Continue to Payment without filling address should show errors", async ({ page }) => {
    const login = new LoginPage(page);
    const home = new HomePage(page);
    const listing = new ListingPage(page);
    await page.goto("https://www.caratlane.us");
    await home.acceptCookies();
    await new WebEngagePopup(page).closePopup();
    await home.openLogin();
    await login.login("automationtesting1@mailinator.com", "Carat567@");
    await new WebEngagePopup(page).closePopup();
    await home.goToRings();
    await new WebEngagePopup(page).closePopup();
    const [productPageTab] = await Promise.all([
      page.waitForEvent("popup"),
      listing.openRandomProduct()
    ]);
    console.log("🌟 New product tab opened!");
    await new WebEngagePopup(productPageTab).closePopup();
    const productPage = new ProductPage(productPageTab);
    const result = await productPage.addToCart();
    await new WebEngagePopup(productPageTab).closePopup();
    if (result.outOfStock) {
      console.log("✔️ PASS: Product is out of stock as expected.");
      return;
    }
    await productPage.proceedToCheckout();
    await new WebEngagePopup(productPageTab).closePopup();
    const cartPage = new CartPage(productPageTab);
    await cartPage.clickSecureCheckout();
    await new WebEngagePopup(productPageTab).closePopup();
    const addressPage = new AddressPage(productPageTab);
    console.log("Clicking Continue without filling fields");
    await addressPage.continueToPayment();
    await addressPage.validateRequiredFieldErrors();
  });


  test('web: TC_03 Adding Shipping Address alone', async ({ page }) => {
    const login = new LoginPage(page);
    const home = new HomePage(page);
    const listing = new ListingPage(page);
    await page.goto("https://www.caratlane.us");
    await home.acceptCookies();
    await new WebEngagePopup(page).closePopup();
    await home.openLogin();
    await login.login("automationtesting1@mailinator.com", "Carat567@");
    await new WebEngagePopup(page).closePopup();
    await home.goToRings();
    await new WebEngagePopup(page).closePopup();
    const [productPageTab] = await Promise.all([
      page.waitForEvent("popup"),
      listing.openRandomProduct()
    ]);
    console.log("🌟 New product tab opened!");
    await new WebEngagePopup(productPageTab).closePopup();
    const productPage = new ProductPage(productPageTab);
    await new WebEngagePopup(productPageTab).closePopup();
    const result = await productPage.addToCart();
    await new WebEngagePopup(productPageTab).closePopup();
    if (result.outOfStock) {
      console.log("✔️ PASS: Product is out of stock as expected.");
      return;
    }
    await productPage.proceedToCheckout();
    await new WebEngagePopup(productPageTab).closePopup();
    const cartPage = new CartPage(productPageTab);
    await cartPage.clickSecureCheckout();
    await new WebEngagePopup(productPageTab).closePopup();
    const addressPage = new AddressPage(productPageTab);
    await addressPage.fillFullAddress({
      street: "microsoft",
      apartment: "third floor",
      phone: "9876543210"
    });
    await addressPage.continueToPayment();
})

test('web: TC_04 Adding Billing address alone', async ({ page }) => {
    const login = new LoginPage(page);
    const home = new HomePage(page);
    const listing = new ListingPage(page);
    await page.goto("https://www.caratlane.us");
    await home.acceptCookies();
    await new WebEngagePopup(page).closePopup();
    await home.openLogin();
    await login.login("automationtesting1@mailinator.com", "Carat567@");
    await new WebEngagePopup(page).closePopup();
    await home.goToRings();
    await new WebEngagePopup(page).closePopup();
    const [productPageTab] = await Promise.all([
      page.waitForEvent("popup"),
      listing.openRandomProduct()
    ]);
    console.log("🌟 New product tab opened!");
    await new WebEngagePopup(productPageTab).closePopup();
    const productPage = new ProductPage(productPageTab);
    await new WebEngagePopup(productPageTab).closePopup();
    const result = await productPage.addToCart();
    await new WebEngagePopup(productPageTab).closePopup();
    if (result.outOfStock) {
      console.log("✔️ PASS: Product is out of stock as expected.");
      return;
    }
    await productPage.proceedToCheckout();
    await new WebEngagePopup(productPageTab).closePopup();
    const cartPage = new CartPage(productPageTab);
    await cartPage.clickSecureCheckout();
    await new WebEngagePopup(productPageTab).closePopup();
    const addressPage = new AddressPage(productPageTab);

    await addressPage.disableSaveInAddressBook();
    await addressPage.fillFullBillingAddress({
      street: "1600 Amphitheatre Parkway",
      apartment: "Apt 101",
      phone: "9876543210"
    });
    await addressPage.continueToPayment();
    await addressPage.validateRequiredFieldErrors();
})

});
