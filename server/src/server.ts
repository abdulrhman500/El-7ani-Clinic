import express, { Request, Response } from 'express';
import { json, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';
import { queryParser } from './middlewares';
import loginRouter from './routes/auth.route';
import generalRouter from './routes/general.route';
import {  userRouter
} from './routes';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(helmet());
app.use(queryParser);
app.use('/auth', loginRouter);
app.use('/users', userRouter);
app.use('/', generalRouter);
app.all('*', (req: Request, res: Response) => res.status(404).send('NOT FOUND'));

export default app;
