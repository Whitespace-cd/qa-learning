import { ENV } from "../config/env";

export const loginTestData = {
    validUser: {
        username: 'standard_user',
        password: 'secret_sauce'
    },
    invalidUser: {
        username: 'wrong_user',
        password: 'wrong_pass'
    },
    lockedOutUser: {
        username: 'locked_out_user',
        password: 'secret_sauce'
    }
};

export const checkoutData = {
   firstName: 'John',
   lastName: 'Doe',
   postalCode: '12345'
}

export const invalidCheckoutCases = [
  {
    testName: 'missing first name',
    firstName: '',
    lastName: 'Doe',
    postalCode: '12345',
    error: 'Error: First Name is required'
  },
  {
    testName: 'missing last name',
    firstName: 'John',
    lastName: '',
    postalCode: '12345',
    error: 'Error: Last Name is required'
  },
  {
    testName: 'missing postal code',
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '',
    error: 'Error: Postal Code is required'
  }
];

