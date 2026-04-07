import {test, expect} from '@playwright/test';
import { ENV } from '../config/env';
import { LoginPage } from '../pages/login.page';
import loginTestData from '../fixtures/testData';


test.describe('Login page tests', () => {
    test('should login successfully with valid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(loginTestData.validUser.username, loginTestData.validUser.password);
        await expect(page).toHaveURL(`${ENV.BASE_URL}/inventory.html`);
    });

    test('should show error message with invalid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(loginTestData.invalidUser.username, loginTestData.invalidUser.password);
        await expect(await loginPage.getErrorMessage()).toBeVisible();
    });

    test('should show error message with locked out credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(loginTestData.lockedOutUser.username, loginTestData.lockedOutUser.password);
        await expect(await loginPage.getErrorMessage()).toBeVisible();
    });

});