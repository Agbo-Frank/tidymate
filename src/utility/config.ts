import 'dotenv/config'

export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT;

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

export const MONGODB_URL = process.env.MONGODB_URL;

export const STRIPE_APIKEY = process.env.STRIPE_APIKEY
export const STRIPE_PUBLICKEY = process.env.STRIPE_PUBLICKEY

export const MAIL_HOST = process.env.MAIL_HOST;
export const MAIL_PORT = process.env.MAIL_PORT;
export const MAIL_USER = process.env.MAIL_USER;
export const MAIL_PASS = process.env.MAIL_PASS;

export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

export const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
export const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

export const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET