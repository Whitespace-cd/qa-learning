import {test, expect} from '@playwright/test';
import { ENV } from '../config/env';
import { InventoryPage } from '../pages/inventory.page';
import { SortOption } from '../enums/SortOption';

test.use({ storageState: 'auth/authState.json' });

let inventoryPage: InventoryPage;

test.beforeEach(async ({page}) => {
    inventoryPage = new InventoryPage(page);
    await inventoryPage.goto();
});


test.describe('Inventory page tests', () => {
    test('after login, should navigate to inventory page', async ({page}) => {
        await expect(page).toHaveURL(`${ENV.BASE_URL}/inventory.html`);
        await expect(page.locator(".title")).toHaveText("Products");
    });

    test('should display correct product names', async ({page}) => {
        const productNames = await inventoryPage.getProductNames();
        expect(productNames.length).toBeGreaterThan(0);
    });

    test('should sort products by price low to high', async ({page}) => {
        await inventoryPage.sortProductsBy(SortOption.PRICE_LOW_TO_HIGH);
        const productPrices = await inventoryPage.getProductPrices();
        const actualPrices = productPrices.map(price => parseFloat(price.replace('$', '')));
        const sortedPrices = [...actualPrices].sort((a, b) => a - b);
        expect(actualPrices).toEqual(sortedPrices);
    });

    test('should sort products by price high to low', async ({page}) => {
        await inventoryPage.sortProductsBy(SortOption.PRICE_HIGH_TO_LOW);
        const productPrices = await inventoryPage.getProductPrices();
        const actualPrices = productPrices.map(price => parseFloat(price.replace('$', '')));
        const sortedPrices = [...actualPrices].sort((a, b) => b - a);
        expect(actualPrices).toEqual(sortedPrices);
    });

    test('should sort products by name A to Z', async ({page}) => {
        await inventoryPage.sortProductsBy(SortOption.NAME_A_TO_Z);
        const productNames = await inventoryPage.getProductNames();
        const sortedNames = [...productNames].sort();
        expect(productNames).toEqual(sortedNames);
    });

    test('should sort products by name Z to A', async ({page}) => {
        await inventoryPage.sortProductsBy(SortOption.NAME_Z_TO_A);
        const productNames = await inventoryPage.getProductNames();
        const sortedNames = [...productNames].sort().reverse();
        expect(productNames).toEqual(sortedNames);
    });

    test('should add product to cart', async ({page}) => {
        const products = await inventoryPage.getProductNames();
        await inventoryPage.addProductToCart(products[0]);
        let itemCount = await inventoryPage.getCartItemCount();
        expect(itemCount).toBe(1);
        await inventoryPage.addProductToCart(products[1]);
        itemCount = await inventoryPage.getCartItemCount();
        expect(itemCount).toBe(2);
    });

    test('should remove product from cart', async ({page}) => {
        const products = await inventoryPage.getProductNames();
        await inventoryPage.addProductToCart(products[0]);
        await inventoryPage.addProductToCart(products[1]);
        let itemCount = await inventoryPage.getCartItemCount();
        expect(itemCount).toBe(2);
        await inventoryPage.removeProductFromCart(products[0]);
        itemCount = await inventoryPage.getCartItemCount();
        expect(itemCount).toBe(1);
    });

    test('should navigate to cart page', async ({page}) => {
        const products = await inventoryPage.getProductNames();
        await inventoryPage.addProductToCart(products[0]);
        await inventoryPage.goToCart();
        await expect(page).toHaveURL(`${ENV.BASE_URL}/cart.html`);
    });

});