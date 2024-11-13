import { Application } from "express";
import auth from "./Auth/router"
import user from "./User/router"
import order from "./Order/router"
import card from "./Card/router"
import wallet from "./Wallet/routes"
import webhook from "./webhook/routes"
import cleaner from "./Cleaner/routes"
import misc from "./mics/routes"
import guard, { guardValid } from "../middleware/guard";

export default function(app: Application){
  app.use("/auth", auth)
  app.use(webhook)
  app.use(guardValid, guard, misc)
  app.use("/wallet", guardValid, guard, wallet)
  app.use("/", guardValid, guard, card)
  app.use("/users", guardValid, guard, user)
  app.use("/orders", guardValid, guard, order)
  app.use("/cleaners", guardValid, guard, cleaner)
}