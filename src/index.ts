import { PORT } from "./utility/config"
import app from "./app"
import Logger from "./utility/logger"

const logger = new Logger("server")

app.listen(PORT, () => {
    logger.log(`Application runing on port ${PORT}...`)
})