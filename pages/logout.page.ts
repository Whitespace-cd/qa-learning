import { Page, Locator } from "@playwright/test";

export class LogoutPage {
    readonly page: Page;
    readonly openMenuButton: Locator;
    readonly logoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.openMenuButton = page.getByTestId('react-burger-menu-btn');
        this.logoutButton = page.getByTestId('logout_sidebar_link');
    }

    async logout() {
        await this.openMenuButton.click();
        await this.logoutButton.click();
        return this;
    }
}