import express from 'express';
import cors from 'cors';
import logger from 'pino-http';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const startServer = () => {
  const app = express();

  app.use(cookieParser());

  app.use(cors());
  app.use(express.json());
  app.use(logger());

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.get('/', (req, res) => {
    res.status(200).json({ message: 'API is running!' });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};
