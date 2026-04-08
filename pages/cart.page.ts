import {Page, Locator} from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly title: Locator;
    readonly itemNames: Locator;
    readonly itemPrices: Locator;
    readonly continueShoppingButton: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('.title');
        this.itemNames = page.locator('.inventory_item_name');
        this.itemPrices = page.locator('.inventory_item_price');
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    
    }

    async goto() {
        await this.page.goto('/cart.html');
        return this;
    }

    async getCartItemNames() {
        return this.itemNames.allTextContents();
    }   

    async getCartItemPrices() {
        return this.itemPrices.allTextContents();
    }   

    async removeProductFromCart(productName: string) {
        const productLocator = this.page.locator('.cart_item').filter({ hasText: productName }).getByRole('button', { name: 'Remove' });
        await productLocator.click();
        return this;
    }   

    async getCartItemCount() {
        const countText = await this.page.locator('.shopping_cart_badge').textContent();
        return countText ? parseInt(countText) : 0;
    }   

    async continueShopping() {
        await this.continueShoppingButton.click();
        return this;
    }   

    async checkout() {
        await this.checkoutButton.click();
        return this;
    }   

}