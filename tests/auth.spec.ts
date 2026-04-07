import {test} from '@playwright/test';
import { ENV } from '../config/env';

test('save auth state for valid login', async ({ page }) => {
    await page.goto(ENV.BASE_URL ?? '');
    await page.getByRole('textbox', { name: 'Username' }).fill(ENV.USERNAME ?? '');
    await page.getByRole('textbox', { name: 'Password' }).fill(ENV.PASSWORD ?? '');
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for the token to be set in localStorage
    await page.waitForURL('**/inventory.html');

    // Save the authentication state to a file
    await page.context().storageState({ path: 'auth/authState.json' });

});