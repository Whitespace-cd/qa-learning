import dotenv from 'dotenv';

const envFile = process.env.ENV || 'dev';
dotenv.config({ path: `./config/.env.${envFile}`, override: true });


export const ENV = {
    BASE_URL: process.env.BASE_URL,
    USERNAME: process.env.USERNAME,
    PASSWORD: process.env.PASSWORD
};

