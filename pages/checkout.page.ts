import {Page, Locator} from '@playwright/test';
import { ENV } from '../config/env';
import test from 'node:test';
import { text } from 'stream/consumers';

export class CheckoutPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;    
    readonly cancelButton: Locator;
    readonly errorMessage: Locator;
    readonly finishButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
        this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
        this.postalCodeInput = page.getByRole('textbox', { name: 'Postal Code' });
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.cancelButton = page.locator('[data-test="cancel"]');
        this.errorMessage = page.locator('[data-test="error"]');
        this.finishButton = page.locator('[data-test="finish"]');
    }

    async goto() {
        await this.page.goto(`${ENV.BASE_URL}/checkout-step-one.html`);
        return this;
    }
    
    async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
        return this;
    }

    async continueCheckout() {
        await this.continueButton.click();
        return this;
    }

    async cancelCheckout() {
        await this.cancelButton.click();
        return this;
    }

    async getErrorMessage() {
        return this.errorMessage.textContent();
    }

    async itemTotal() {
        const text = await this.page.locator('[data-test="subtotal-label"]').textContent();
        return this.extractAmount(text);
    }

    async tax() {
        const text = await this.page.locator('[data-test="tax-label"]').textContent();
        return this.extractAmount(text);
    }

    async total() {
        const text = await this.page.locator('[data-test="total-label"]').textContent();
        return this.extractAmount(text);
    }

    async finishCheckout() {
        await this.finishButton.click();
        return this;
    }

    async getSuccessMessage() {
        return this.page.locator('[data-test="complete-header"]').textContent();
    }

    private extractAmount(text: string | null): number {
        return parseFloat(text?.replace(/[^0-9.]/g, '') ?? '0');
    }

}