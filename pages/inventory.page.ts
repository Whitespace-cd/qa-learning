import {Page, Locator} from '@playwright/test'; 
import { LogoutPage } from './logout.page';

export class InventoryPage extends LogoutPage{
    readonly title: Locator;

    constructor(page: Page) {
        super(page);
        this.title = page.locator('.title');
    }

    async goto() {
        await this.page.goto('/inventory.html');
    }

    // async getTitle() {
    //     return this.title.textContent();
    // }   

    // async isAt() {
    //     return (this.page.url()).includes('/inventory.html');
    // }   

    async getProductNames() {
        return this.page.locator('.inventory_item_name').allTextContents();
    }

    async sortProductsBy(option: string) {
        await this.page.selectOption('.product_sort_container', option);
        return this;
    }

    async getProductPrices() {
        return this.page.locator('.inventory_item_price').allTextContents();
    }   

    async addProductToCart(productName: string) {
        const productLocator = this.page.locator('.inventory_item').filter({ hasText: productName }).getByRole('button', { name: 'Add to cart' });
        await productLocator.click();
        return this;
    }

    async removeProductFromCart(productName: string) {
        const productLocator = this.page.locator('.inventory_item').filter({ hasText: productName }).getByRole('button', { name: 'Remove' });
        await productLocator.click();
        return this;
    }   

    async getCartItemCount() {
        const countText = await this.page.locator('[data-test="shopping-cart-badge"]').textContent();
        return countText ? parseInt(countText) : 0;
        
    }   

    async goToCart() {
        await this.page.locator('[data-test="shopping-cart-link"]').click();
        return this;
    }

}
