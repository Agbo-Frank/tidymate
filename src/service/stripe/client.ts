import Axios from 'axios';
import { STRIPE_APIKEY } from "../../utility/config";

const client = Axios.create({
  baseURL: "https://api.stripe.com/v1",
  headers: {
    'Accept': 'application/x-www-form-urlencoded',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': "Bearer " + STRIPE_APIKEY
  },
});

export default client;