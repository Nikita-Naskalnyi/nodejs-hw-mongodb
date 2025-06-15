import dotenv from 'dotenv';
dotenv.config();

console.log('USER:', process.env.MONGODB_USER);

import mongoose from 'mongoose';
import { startServer } from './server.js';

const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;

const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

mongoose
  .connect(uri)
  .then(() => {
    console.log('MongoDB connected');
    startServer();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  });
