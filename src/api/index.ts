import { Application } from "express";
import auth from "./Auth/router"
import user from "./User/router"
import order from "./Order/router"
import card from "./Card/router"
import wallet from "./Wallet/routes"
import webhook from "./webhook/routes"
import cleaner from "./Cleaner/routes"
import guard, { guardValid } from "../middleware/guard";

export default function(app: Application){
  app.use(auth)
  app.use(webhook)
  app.use(guardValid, guard, wallet)
  app.use(guardValid, guard, card)
  app.use(guardValid, guard, user)
  app.use(guardValid, guard, order)
  app.use(guardValid, guard, cleaner)
}