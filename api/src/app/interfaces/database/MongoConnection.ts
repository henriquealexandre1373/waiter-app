import logger from '@services/loggerService';
import mongoose from 'mongoose';

let isTestEnv = process.env.NODE_ENV === 'test';

export const connectToMongo = async (uri: string) => {
  try {
    if (isTestEnv && mongoose.connection.readyState === 0) {
      return;
    }

    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017'
    );
    logger.info(`Connected to MongoDB at ${uri}`);
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export const disconnectFromMongo = async () => {
  await mongoose.connection.close();
};
