import express from 'express';
import dotenv from 'dotenv';
import indexRouter from './routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { AppDataSource } from './database/dataSource';

dotenv.config();

AppDataSource.initialize().then(() => {
  // load env variables
  const CLIENT_HOST = process.env.CLIENT_HOST || 'http://localhost:3000';
  const PORT = process.env.PORT || 8082;
  // create express app
  const app = express();
  // middleware
  app.use(cors({ credentials: true, origin: CLIENT_HOST }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ limit: '100mb', extended: true }));
  // routes
  app.use(indexRouter);
  // start server
  app.listen(PORT, () => {
    console.log(`Service listening on port ${PORT}...`);
  });
});
