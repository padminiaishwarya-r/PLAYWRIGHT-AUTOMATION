import { test, expect } from '@playwright/test';
import HomePage from '../../pages/HomePage.js';
import ListingPage from '../../pages/ListingPage.js';
import WebEngagePopup from '../../utils/webengagePopup.js';
import { saveWebVitals } from '../../utils/webvitalsStore.js';


    test.describe("Listing Page Cases", () => {
        test('web: TC_01 Open Random Product in Listing', async ({ page }) => {
            const home = new HomePage(page);
            const listing = new ListingPage(page);
            await page.goto("https://www.caratlane.us");
            await home.acceptCookies();
            await home.goToRings();
            await new WebEngagePopup(page).closePopup();
            const vitals = await listing.captureWebVitals();
            saveWebVitals('Listing Page Cases', 'TC_01 Open Random Product in Listing', page.url(), vitals);
            console.log(`📊 CLS: ${vitals.cls} → ${vitals.clsStatus}`);
            console.log(`📊 LCP: ${vitals.lcp} → ${vitals.lcpStatus}`);
            await listing.openRandomProduct();
        })

        test('web: TC_02 Click Wishlist for a random product as Guest User', async ({ page }) => {
            const home = new HomePage(page);
            const listing = new ListingPage(page);
            await page.goto("https://www.caratlane.us");
            await home.acceptCookies();
            await home.goToRings();
            await new WebEngagePopup(page).closePopup();              
            await  listing.clickRandomWishlist();
            const vitals = await listing.captureWebVitals();
            saveWebVitals('Listing Page Cases', 'TC_02 Click Wishlist for a random product as Guest User', page.url(), vitals);
            console.log(`📊 CLS: ${vitals.cls} → ${vitals.clsStatus}`);
            console.log(`📊 LCP: ${vitals.lcp} → ${vitals.lcpStatus}`);
        })

        test('web: TC_03 Verify SortBy Section', async ({ page }) => {
            const home = new HomePage(page);
            const listing = new ListingPage(page);
            await page.goto("https://www.caratlane.us");
            await home.acceptCookies();
            await home.goToRings();
            await new WebEngagePopup(page).closePopup();
            const vitals = await listing.captureWebVitals();
            saveWebVitals('Listing Page Cases', 'TC_03 Verify SortBy Section', page.url(), vitals);
            console.log(`📊 CLS: ${vitals.cls} → ${vitals.clsStatus}`);
            console.log(`📊 LCP: ${vitals.lcp} → ${vitals.lcpStatus}`);
            await listing.sortByRandom();
        })

        test("web: TC_04 Verify Filters Section", async ({ page }) => {
            const home = new HomePage(page);
            const listing = new ListingPage(page);
            await page.goto("https://www.caratlane.us");
            await home.acceptCookies();
            await home.goToRings();
            await new WebEngagePopup(page).closePopup();
            const result = await listing.applyRandomFilter();
            const vitals = await listing.captureWebVitals();
            saveWebVitals('Listing Page Cases', 'TC_04 Verify Filters Section', page.url(), vitals);
            console.log(`📊 CLS: ${vitals.cls} → ${vitals.clsStatus}`);
            console.log(`📊 LCP: ${vitals.lcp} → ${vitals.lcpStatus}`);
            console.log("🔍 DEBUG RESULT:", result);
            expect(result.success).toBeTruthy();

          });
          
          test('web: TC_05 Click Live Video Call CTA', async ({ page }) => {
            const home = new HomePage(page);
            const listing = new ListingPage(page);
            await page.goto("https://www.caratlane.us");
            await home.acceptCookies();
            await home.goToRings();
            await new WebEngagePopup(page).closePopup();
            const vitals = await listing.captureWebVitals();
            saveWebVitals('Listing Page Cases', 'TC_05 Click Live Video Call CTA', page.url(), vitals);
            console.log(`📊 CLS: ${vitals.cls} → ${vitals.clsStatus}`);
            console.log(`📊 LCP: ${vitals.lcp} → ${vitals.lcpStatus}`);
            await listing.clickRandomLiveVideoCall();
          });
})