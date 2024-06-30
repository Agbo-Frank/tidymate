import { initializeApp, cert, GoogleOAuthAccessToken } from 'firebase-admin/app';

const firebase = initializeApp({
  credential: cert(require("../../google-service-key.json"))
})