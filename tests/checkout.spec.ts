import {test, expect} from '@playwright/test';
import { ENV } from '../config/env';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { checkoutData, invalidCheckoutCases } from '../fixtures/testData';

test.use({ storageState: 'auth/authState.json' });

let inventoryPage: InventoryPage;
let cartPage: CartPage;
let checkoutPage: CheckoutPage;

async function navigateToCheckout() {
    const products = await inventoryPage.getProductNames();
    await inventoryPage.addProductToCart(products[0]);
    await inventoryPage.goToCart();
    await cartPage.checkout();
}

test.beforeEach(async ({page}) => {
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    await inventoryPage.goto();
});

test.describe('Checkout page tests', () => {
    test('should navigate to checkout page', async ({page}) => {        
        await navigateToCheckout();
        await expect(page).toHaveURL(`${ENV.BASE_URL}/checkout-step-one.html`);
    });

    test('should display error message for missing information', async ({page}) => {        
        await navigateToCheckout();
        await checkoutPage.continueCheckout();
        const errorMessage = await checkoutPage.getErrorMessage();
        expect(errorMessage).toBe('Error: First Name is required');
    });

    test('should complete checkout process', async ({page}) => {
        await navigateToCheckout();
        await checkoutPage.fillCheckoutInformation(
            checkoutData.firstName,
            checkoutData.lastName,
            checkoutData.postalCode
        );
        await checkoutPage.continueCheckout();
        await checkoutPage.finishCheckout();
        await expect(page).toHaveURL(`${ENV.BASE_URL}/checkout-complete.html`);
    });

    test('should cancel checkout process', async ({page}) => {
        await navigateToCheckout();
        await checkoutPage.cancelCheckout();
        await expect(page).toHaveURL(`${ENV.BASE_URL}/cart.html`);
    });

    test('should display error for missing postal code', async ({page}) => {
        await navigateToCheckout();
        await checkoutPage.fillCheckoutInformation(
            invalidCheckoutCases[2].firstName,
            invalidCheckoutCases[2].lastName,
            invalidCheckoutCases[2].postalCode
        );
        await checkoutPage.continueCheckout();
        const errorMessage = await checkoutPage.getErrorMessage();
        expect(errorMessage).toBe('Error: Postal Code is required');
    });

    test('should display error for missing last name', async ({page}) => {        
        await navigateToCheckout();
        await checkoutPage.fillCheckoutInformation(
            invalidCheckoutCases[1].firstName,
            invalidCheckoutCases[1].lastName,
            invalidCheckoutCases[1].postalCode
        );
        await checkoutPage.continueCheckout();
        const errorMessage = await checkoutPage.getErrorMessage();
        expect(errorMessage).toBe('Error: Last Name is required');
    });

    test('should display error for missing first name', async ({page}) => {        
        await navigateToCheckout();
        await checkoutPage.fillCheckoutInformation(
            invalidCheckoutCases[0].firstName,
            invalidCheckoutCases[0].lastName,
            invalidCheckoutCases[0].postalCode
        );
        await checkoutPage.continueCheckout();
        const errorMessage = await checkoutPage.getErrorMessage();
        expect(errorMessage).toBe('Error: First Name is required');
    });

    test('should display error for all fields missing', async ({page}) => {        
        await navigateToCheckout();
        await checkoutPage.fillCheckoutInformation('', '', '');    
        await checkoutPage.continueCheckout();
        const errorMessage = await checkoutPage.getErrorMessage();
        expect(errorMessage).toBe('Error: First Name is required');
    });

    test('should display success message after checkout', async ({page}) => {
        await navigateToCheckout();
        await checkoutPage.fillCheckoutInformation(
            checkoutData.firstName,
            checkoutData.lastName,
            checkoutData.postalCode
        );
        await checkoutPage.continueCheckout();
        await checkoutPage.finishCheckout();
        const successMessage = await checkoutPage.getSuccessMessage();
        expect(successMessage).toBe('Thank you for your order!');
    });

    test('should calculate correct totals', async ({page}) => {
        await navigateToCheckout();
        await checkoutPage.fillCheckoutInformation(
            checkoutData.firstName,
            checkoutData.lastName,
            checkoutData.postalCode
        );
        await checkoutPage.continueCheckout();
        const itemTotal = await checkoutPage.itemTotal();
        const tax = await checkoutPage.tax();
        const total = await checkoutPage.total();

        expect(total).toBeCloseTo(itemTotal + tax, 2);
    });
});