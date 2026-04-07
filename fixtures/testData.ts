import { ENV } from "../config/env";

const loginTestData = {
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

export default loginTestData