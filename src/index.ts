import path from 'node:path';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config({ path: path.resolve(__dirname, '../env/.env') });

import { router } from './router';
import errorHandler from '@interfaces/http/middlewares/errorHandlerMiddleware';
import logger from '@services/loggerService';
import { connectToMongo } from '@interfaces/database/MongoConnection';

export const app = express();
const port = process.env.PORT;

const mongoUri = process.env.MONGO_URI as string;

const startServer = async () => {
  try {
    await connectToMongo(mongoUri);

    app.use(
      '/uploads',
      express.static(path.resolve(__dirname, '..', 'uploads'))
    );
    app.use(express.json());
    app.use(router);
    app.use(errorHandler);

    app.listen(port, () => {
      logger.info(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    logger.error('Error starting the server');
  }
};

startServer();
