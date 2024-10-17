import { createClient } from "redis"
import Logger from "../utility/logger"
import { NODE_ENV } from "../utility/config"

// const client = createClient({ url:  "redis://red-crugukbv2p9s73er9qng:6379" })
const client = createClient(NODE_ENV === "development" ? null : { url:  "redis://red-crugukbv2p9s73er9qng:6379" })
const logger = new Logger("server")

client.on("error", (err) => logger.log('Redis Client Error', err))
client.on("connect", () => logger.log('Redis connected...'))

export default client