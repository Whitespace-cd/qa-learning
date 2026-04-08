import {test, expect} from '@playwright/test';
import { ENV } from '../config/env';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';  

test.use({ storageState: 'auth/authState.json' });

let inventoryPage: InventoryPage;

test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    await inventoryPage.goto();
});

test.describe('Cart page tests', () => {
    test('should navigate to cart page when cart icon is clicked', async ({page}) => {
        await inventoryPage.goToCart();
        await expect(page).toHaveURL(`${ENV.BASE_URL}/cart.html`);
        await expect(page.locator(".title")).toHaveText("Your Cart");
    });

    test('should display correct items in cart', async ({page}) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.addProductToCart('Sauce Labs Bike Light');
        await inventoryPage.goToCart();
        const cartPage = new CartPage(page);
        const cartItemNames = await cartPage.getCartItemNames();
        expect(cartItemNames).toContain('Sauce Labs Backpack');
        expect(cartItemNames).toContain('Sauce Labs Bike Light');
    });

    test('should remove item from cart', async ({page}) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.goToCart();
        const cartPage = new CartPage(page);
        await cartPage.removeProductFromCart('Sauce Labs Backpack');
        const cartItemNames = await cartPage.getCartItemNames();
        expect(cartItemNames).not.toContain('Sauce Labs Backpack');
    });

    test('should display correct item count in cart badge', async ({page}) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.addProductToCart('Sauce Labs Bike Light');
        const itemCount = await inventoryPage.getCartItemCount();
        expect(itemCount).toBe(2);
    });

    test('should navigate back to inventory page when continue shopping is clicked', async ({page}) => {   
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.goToCart();
        const cartPage = new CartPage(page);
        await cartPage.continueShopping();
        await expect(page).toHaveURL(`${ENV.BASE_URL}/inventory.html`);
    });

    test('should navigate to checkout page when checkout button is clicked', async ({page}) => {     
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.goToCart();
        const cartPage = new CartPage(page);
        await cartPage.checkout();
        await expect(page).toHaveURL(`${ENV.BASE_URL}/checkout-step-one.html`);
    });

    test('should display correct prices for items in cart', async ({page}) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.addProductToCart('Sauce Labs Bike Light');
        await inventoryPage.goToCart();
        const cartPage = new CartPage(page);
        const cartItemPrices = await cartPage.getCartItemPrices();
        expect(cartItemPrices).toContain('$29.99');
        expect(cartItemPrices).toContain('$9.99');
    });

    test('should update cart badge count when item is removed from cart', async ({page}) => {  
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.addProductToCart('Sauce Labs Bike Light');
        await inventoryPage.goToCart();
        const cartPage = new CartPage(page);
        await cartPage.removeProductFromCart('Sauce Labs Backpack');
        const itemCount = await inventoryPage.getCartItemCount();
        expect(itemCount).toBe(1);
    });

});