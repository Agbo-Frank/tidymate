import { PORT } from "./utility/config"
import app from "./app"
import Logger from "./utility/logger"
import * as config from "./utility/config"
import { isEmpty } from "./utility/helpers"

const logger = new Logger("server")

if(Object.values(config).some(value => isEmpty(value))){
  Object.entries(config).forEach(values => {
      if(isEmpty(values[1])) console.log(`${values[0]} is undefined`)
  })
  throw new Error("Please enter all config values")
}
else{
  app.listen(PORT, () => {
    logger.log(`Application runing on port ${PORT}...`)
  })
}