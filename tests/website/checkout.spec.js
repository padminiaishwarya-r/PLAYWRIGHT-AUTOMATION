import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/LoginPage.js';
import HomePage from '../../pages/HomePage.js';
import ListingPage from '../../pages/ListingPage.js';
import ProductPage from '../../pages/ProductPage.js';
import CartPage from '../../pages/CartPage.js';
import AddressPage from '../../pages/AddressPage.js';
import PaymentPage from '../../pages/PaymentPage.js';
import WebEngagePopup from '../../utils/webengagePopup.js';
import { saveWebVitals } from '../../utils/webvitalsStore.js';

  test.describe("Checkout Cases", () => {
   test('web: TC_01 Add product from Rings category @checkout', async ({ page }) => {
    const login = new LoginPage(page);
    const home = new HomePage(page);
    const listing = new ListingPage(page);
    await page.goto('/');
    await home.acceptCookies();
    await new WebEngagePopup(page).closePopup();
    await home.openLogin();
    await login.login(
      process.env.LOGIN_EMAIL,
      process.env.LOGIN_PASSWORD
    );    await new WebEngagePopup(page).closePopup();
    await home.goToRings();
    await new WebEngagePopup(page).closePopup();
    const [productPageTab] = await Promise.all([
      page.waitForEvent("popup"),
      listing.openRandomProduct()
    ]);
    console.log("🌟 New product tab opened!");
    await new WebEngagePopup(productPageTab).closePopup();
    const productPage = new ProductPage(productPageTab);
    await productPage.addToWishlist();
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
    const paymentPage = new PaymentPage(productPageTab);
    await paymentPage.clickPlaceOrder();
    const vitals = await paymentPage.captureWebVitals();
    saveWebVitals('Checkout Page Cases', 'TC_01 Navigating to Checkout', page.url(), vitals);
    console.log(`📊 CLS: ${vitals.cls} → ${vitals.clsStatus}`);
    console.log(`📊 LCP: ${vitals.lcp} → ${vitals.lcpStatus}`);
  });

});
