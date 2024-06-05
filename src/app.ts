import express from 'express'
import helmet from 'helmet';
import cors from 'cors';
import ErrorHandler from './middleware/error-handler';
import { connectMongodb } from './service/mongoose';
import Logger from './utility/logger';
import api from './api';
import redis from "./service/redis"

const logger = new Logger("server")

const app = express();

redis.connect();
connectMongodb()

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
	origin: '*',
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json({limit: "10mb" }));
app.use((req, _, next) => {
  logger.log(`${req.method.toUpperCase()} ${req.url}`)
  next()
})
api(app)
app.use(ErrorHandler)

app.disable('x-powered-by')
export default app