import express from 'express';
import cors from 'cors';
import { getAllContacts, getContactById } from './controllers/contacts.js';
import logger from 'pino-http';

export const startServer = () => {
  const app = express();

  app.use(cors());
  app.use(logger());

  app.get('/contacts', getAllContacts);
  app.get('/contacts/:id', getContactById);

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
