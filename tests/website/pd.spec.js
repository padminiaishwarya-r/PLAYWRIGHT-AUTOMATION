import { test, expect } from '@playwright/test';
import HomePage from '../../pages/HomePage.js';
import ListingPage from '../../pages/ListingPage.js';
import ProductPage from '../../pages/ProductPage.js';
import WebEngagePopup from '../../utils/webengagePopup.js';
import { saveWebVitals } from '../../utils/webvitalsStore.js';

    test.describe("Product Detail Page Cases", () => {
      test('web: TC_01 Add product to Wishlist', async ({ page }) => {
        const home = new HomePage(page);
        const listing = new ListingPage(page);
        await page.goto("https://www.caratlane.us");
        await home.acceptCookies();
        await home.goToRings();
        const listingPopup = new WebEngagePopup(page);
        await listingPopup.closePopup();
        const [productPageTab] = await Promise.all([
        page.waitForEvent("popup", { timeout: 15000 }),
        listing.openRandomProduct()
      ]);
        console.log("🌟 New product tab opened!");
        await productPageTab.waitForLoadState("domcontentloaded"); 
        const productPopup = new WebEngagePopup(productPageTab);
        await productPopup.closePopup();
        const productPage = new ProductPage(productPageTab);
        await productPopup.closePopup();
        await productPage.addToWishlist();
        const vitals = await productPage.captureWebVitals();
        saveWebVitals('Product Details Page Cases', 'TC_01 Add product to Wishlist', page.url(), vitals);
        console.log(`📊 CLS: ${vitals.cls} → ${vitals.clsStatus}`);
        console.log(`📊 LCP: ${vitals.lcp} → ${vitals.lcpStatus}`);
        await productPopup.closePopup();
      });
      
        test('web: TC_02 Check Share Functionality', async ({ page }) => {
            const home = new HomePage(page);
            const listing = new ListingPage(page);
            await page.goto("https://www.caratlane.us");
            await home.acceptCookies();
            await home.goToRings();
            const listingPopup = new WebEngagePopup(page);
            await listingPopup.closePopup();            
            await new WebEngagePopup(page).closePopup();
            const [productPageTab] = await Promise.all([
              page.waitForEvent("popup", { timeout: 15000 }),
              listing.openRandomProduct()
            ]);
            console.log("🌟 New product tab opened!");
            const productPopup = new WebEngagePopup(productPageTab);
            await productPopup.closePopup();
            const productPage = new ProductPage(productPageTab);
            await productPopup.closePopup();
            const vitals = await productPage.captureWebVitals();
            saveWebVitals('Product Details Page Cases', 'TC_02 Check Share Functionality', page.url(), vitals);
            console.log(`📊 CLS: ${vitals.cls} → ${vitals.clsStatus}`);
            console.log(`📊 LCP: ${vitals.lcp} → ${vitals.lcpStatus}`)
            await productPage.verifyShareFunctionality();
        });

        test('web: TC_03 Check Similar Items Functionality', async ({ page }) => {
            const home = new HomePage(page);
            const listing = new ListingPage(page);
            await page.goto("https://www.caratlane.us");
            await home.acceptCookies();
            await home.goToRings();
            const listingPopup = new WebEngagePopup(page);
            await listingPopup.closePopup();           
            await new WebEngagePopup(page).closePopup();
            const [productPageTab] = await Promise.all([
              page.waitForEvent("popup", { timeout: 15000 }),
              listing.openRandomProduct()
            ]);
            console.log("🌟 New product tab opened!");
            const productPopup = new WebEngagePopup(productPageTab);
            await productPopup.closePopup();
            const productPage = new ProductPage(productPageTab);
            await productPopup.closePopup();
            await productPage.clickSimilarItems();
            const vitals = await productPage.captureWebVitals();
            saveWebVitals('Product Details Page Cases', 'TC_03 Check Similar Items Functionality', page.url(), vitals);
            console.log(`📊 CLS: ${vitals.cls} → ${vitals.clsStatus}`);
            console.log(`📊 LCP: ${vitals.lcp} → ${vitals.lcpStatus}`)
        });
   
        test('web: TC_04 Check Trending Items Functionality', async ({ page }) => {
            const home = new HomePage(page);
            const listing = new ListingPage(page);
            await page.goto("https://www.caratlane.us");
            await home.acceptCookies();
            await home.goToRings();
             const listingPopup = new WebEngagePopup(page);
            await listingPopup.closePopup();           
            await new WebEngagePopup(page).closePopup();
            const [productPageTab] = await Promise.all([
              page.waitForEvent("popup", { timeout: 15000 }),
              listing.openRandomProduct()
            ]);
            console.log("🌟 New product tab opened!");
            const productPopup = new WebEngagePopup(productPageTab);
            await productPopup.closePopup();
            const productPage = new ProductPage(productPageTab);
            await productPopup.closePopup();
            await productPage.clickTrendingItems();
            const vitals = await productPage.captureWebVitals();
            saveWebVitals('Product Details Page Cases', 'TC_04 Check Trending Items Functionality', page.url(), vitals);
            console.log(`📊 CLS: ${vitals.cls} → ${vitals.clsStatus}`);
            console.log(`📊 LCP: ${vitals.lcp} → ${vitals.lcpStatus}`)
        });

        test('web: TC_05 Check Product Design Details  Functionality', async ({ page }) => {
            const home = new HomePage(page);
            const listing = new ListingPage(page);
            await page.goto("https://www.caratlane.us");
            await home.acceptCookies();
            await home.goToRings();
            const listingPopup = new WebEngagePopup(page);
            await listingPopup.closePopup();           
            await new WebEngagePopup(page).closePopup();
            const [productPageTab] = await Promise.all([
              page.waitForEvent("popup", { timeout: 15000 }),
              listing.openRandomProduct()
            ]);
            console.log("🌟 New product tab opened!");
            const productPopup = new WebEngagePopup(productPageTab);
            await productPopup.closePopup();
            const productPage = new ProductPage(productPageTab);
            await productPopup.closePopup();
            await productPage.extractPdpDetails();
            const vitals = await productPage.captureWebVitals();
            saveWebVitals('Product Details Page Cases', 'TC_05 Check Product Design Details Functionality', page.url(), vitals);
            console.log(`📊 CLS: ${vitals.cls} → ${vitals.clsStatus}`);
            console.log(`📊 LCP: ${vitals.lcp} → ${vitals.lcpStatus}`)
        });

        test('web: TC_06 Check Product Customization Functionality', async ({ page }) => {
            const home = new HomePage(page);
            const listing = new ListingPage(page);
            await page.goto("https://www.caratlane.us");
            await home.acceptCookies();
           await home.goToRings();
           const listingPopup = new WebEngagePopup(page);
            await listingPopup.closePopup();           
            await new WebEngagePopup(page).closePopup();
            const [productPageTab] = await Promise.all([
              page.waitForEvent("popup", { timeout: 15000 }),
              listing.openRandomProduct()
            ]);
            console.log("🌟 New product tab opened!");
            const productPopup = new WebEngagePopup(productPageTab);
            await productPopup.closePopup();
            const productPage = new ProductPage(productPageTab);
            await productPopup.closePopup();
            await productPage.extractPdpDetails();
            await productPage.customiseAndValidate();
            const vitals = await productPage.captureWebVitals();
            saveWebVitals('Product Details Page Cases', ' TC_06 Check Product Customization Functionality', page.url(), vitals);
            console.log(`📊 CLS: ${vitals.cls} → ${vitals.clsStatus}`);
            console.log(`📊 LCP: ${vitals.lcp} → ${vitals.lcpStatus}`)
            await productPage.extractPdpDetails();
        });
        
        test('web: TC_07 Check Mini PoP! Functionality', async ({ page }) => {
            const home = new HomePage(page);
            const listing = new ListingPage(page);
            await page.goto("https://www.caratlane.us");
            await home.acceptCookies();
           await home.goToRings();
           const listingPopup = new WebEngagePopup(page);
            await listingPopup.closePopup();           
            await new WebEngagePopup(page).closePopup();
            const [productPageTab] = await Promise.all([
              page.waitForEvent("popup", { timeout: 15000 }),
              listing.openRandomProduct()
            ]);
            console.log("🌟 New product tab opened!");
            const productPopup = new WebEngagePopup(productPageTab);
            await productPopup.closePopup();
            const productPage = new ProductPage(productPageTab);
            await productPopup.closePopup();
            await productPage.openMiniPopup();
            const vitals = await productPage.captureWebVitals();
            saveWebVitals('Product Details Page Cases', 'TC_07 Check Mini PoP! Functionality', page.url(), vitals);
            console.log(`📊 CLS: ${vitals.cls} → ${vitals.clsStatus}`);
            console.log(`📊 LCP: ${vitals.lcp} → ${vitals.lcpStatus}`)
            await productPage.closePopPopup();
        }); 
        
        test('web: TC_08 Check Mini PoP! start your trial Functionality', async ({ page }) => {
            const home = new HomePage(page);
            const listing = new ListingPage(page);
            await page.goto("https://www.caratlane.us");
            await home.acceptCookies();
           await home.goToRings();
           const listingPopup = new WebEngagePopup(page);
            await listingPopup.closePopup();           
            await new WebEngagePopup(page).closePopup();
            const [productPageTab] = await Promise.all([
              page.waitForEvent("popup", { timeout: 15000 }),
              listing.openRandomProduct()
            ]);
            console.log("🌟 New product tab opened!");
            const productPopup = new WebEngagePopup(productPageTab);
            await productPopup.closePopup();
            const productPage = new ProductPage(productPageTab);
            await productPopup.closePopup();
            await productPage.openMiniPopup();
            await productPage.selectRandomPriceAndStartPlan();
            const vitals = await productPage.captureWebVitals();
            saveWebVitals('Product Details Page Cases', 'TC_08 Check Mini PoP! start your trial Functionality', page.url(), vitals);
            console.log(`📊 CLS: ${vitals.cls} → ${vitals.clsStatus}`);
            console.log(`📊 LCP: ${vitals.lcp} → ${vitals.lcpStatus}`);
            });    
})