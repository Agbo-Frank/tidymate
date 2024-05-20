import express from 'express'
import helmet from 'helmet';
import cors from 'cors';
import ErrorHandler from './middleware/error-handler';

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
	origin: '*',
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json({limit: "10mb"}));

app.use(ErrorHandler)

app.disable('x-powered-by')
export default app