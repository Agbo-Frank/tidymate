import Axios from 'axios';
import { NODE_ENV, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } from "../../utility/config";
import { compareStrings } from "../../utility/helpers";

const access_token = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')

const client = Axios.create({
  baseURL: compareStrings(NODE_ENV, "production") ? "" : "https://api-m.sandbox.paypal.com/v2",
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${access_token}`
  },
})

export default client;