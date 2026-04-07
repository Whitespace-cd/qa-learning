import {Page, Locator} from '@playwright/test';
import { ENV } from '../config/env';
// import {InventoryPage} from './InventoryPage';

export class LoginPage {
    static goto() {
        throw new Error('Method not implemented.');
    }
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByRole('textbox', { name: 'Username' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    async goto() {
        await this.page.goto(ENV.BASE_URL ?? '');
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }


    async getErrorMessage() {
        return this.page.locator('[data-test="error"]');
    }

}

