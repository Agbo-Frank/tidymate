import { createClient } from "redis"
import Logger from "../utility/logger"

const client = createClient()
const logger = new Logger("server")

client.on("error", (err) => logger.log('Redis Client Error', err))
client.on("connect", () => logger.log('Redis connected...'))

export default client