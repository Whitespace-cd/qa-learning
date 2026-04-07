import {test, expect} from '@playwright/test';
import { ENV } from '../config/env';
import { InventoryPage } from '../pages/inventory.page';

test.use({ storageState: 'auth/authState.json' });

test.describe('Inventory page tests', () => {
    test('after login, should navigate to inventory page', async ({page}) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.goto(); 
        await expect(page).toHaveURL(`${ENV.BASE_URL}/inventory.html`);
        await expect(page.locator(".title")).toHaveText("Products");
    });

    test('should display correct product names', async ({page}) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.goto();
        const productNames = await inventoryPage.getProductNames();
        expect(productNames.length).toBeGreaterThan(0);
    });

    test('should sort products by price low to high', async ({page}) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.goto(); 
        await inventoryPage.sortProductsBy('lohi');
        const productPrices = await inventoryPage.getProductPrices();
        const actualPrices = productPrices.map(price => parseFloat(price.replace('$', '')));
        const sortedPrices = [...actualPrices].sort((a, b) => a - b);
        expect(actualPrices).toEqual(sortedPrices);
    });

    test('should add product to cart', async ({page}) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.goto(); 
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        let itemCount = await inventoryPage.getCartItemCount();
        expect(itemCount).toBe(1);
        await inventoryPage.addProductToCart('Sauce Labs Bike Light');
        itemCount = await inventoryPage.getCartItemCount();
        expect(itemCount).toBe(2);
    });

    test('should remove product from cart', async ({page}) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.goto(); 
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.addProductToCart('Sauce Labs Bike Light');
        let itemCount = await inventoryPage.getCartItemCount();
        expect(itemCount).toBe(2);
        await inventoryPage.removeProductFromCart('Sauce Labs Backpack');
        itemCount = await inventoryPage.getCartItemCount();
        expect(itemCount).toBe(1);
    });

    test('should navigate to cart page', async ({page}) => {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.goto(); 
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.goToCart();
        await expect(page).toHaveURL(`${ENV.BASE_URL}/cart.html`);
    });

});