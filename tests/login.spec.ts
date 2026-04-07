import {test, expect} from '@playwright/test';
import { ENV } from '../config/env';


test.describe('Go to site page', () => {
    test('should navigate to the site', async ({page}) => {
        await page.goto('/');
        await expect(page).toHaveURL('https://www.saucedemo.com/');
        await page.getByRole('textbox', { name: 'Username' }).fill(ENV.USERNAME ?? '');
        await page.getByRole('textbox', { name: 'Password' }).fill(ENV.PASSWORD ?? '');
    });
});

