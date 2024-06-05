import { Application } from "express";
import auth from "./Auth/router"
import user from "./User/router"
import guard, { guardValid } from "../middleware/guard";

export default function(app: Application){
  app.use(auth)
  app.use(guardValid, guard, user, user)
}