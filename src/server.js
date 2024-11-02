import dotenv from 'dotenv';
import express from 'express';
import pino from 'pino-http';
import pretty from "pino-pretty";
import cors from 'cors';

import router from './routes/index.js'
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';

dotenv.config()
const PORT = Number(process.env.PORT);

export function setupServer() {
  const app = express()

  app.use(express.json())
  app.use(cors())
  app.use(cookieParser())

  app.use(
      pino({
        transport: {
          target: 'pino-pretty',
        },
      }),
  );

  app.get('/', (req, res) => {
      res.json({
        message: 'Hello World!',
      });
  });

  app.use(router)

  app.use('*', notFoundHandler)

  app.use(errorHandler);

  app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
  })
}