import {test, expect} from '@playwright/test';
import { ENV } from '../config/env';

test.use({ storageState: 'auth/authState.json' });

test.describe('Inventory page tests', () => {
    test('after login, should navigate to inventory page', async ({page}) => {
        await page.goto('/inventory.html');
        await expect(page).toHaveURL(`${ENV.BASE_URL}/inventory.html`);
        await expect(page.locator(".title")).toHaveText("Products");
    });
});