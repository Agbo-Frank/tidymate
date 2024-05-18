import 'dotenv/config'

export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT;

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

export const MONGODB_URL = process.env.MONGODB_URL;

export const STRIPE_APIKEY = process.env.STRIPE_APIKEY

export const MAIL_HOST = process.env.MAIL_HOST;
export const MAIL_PORT = process.env.MAIL_PORT;
export const MAIL_USER = process.env.MAIL_USER;
export const MAIL_PASS = process.env.MAIL_PASS;