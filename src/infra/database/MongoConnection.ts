import logger from '@services/loggerService';
import mongoose from 'mongoose';

const isTestEnv = process.env.NODE_ENV === 'test';

export const connectToMongo = async (uri: string) => {
  try {
    if (isTestEnv && mongoose.connection.readyState === 0) {
      return;
    }

    if (!uri) {
      throw new Error('MONGO_URI is not defined');
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info(`Connected to MongoDB at ${uri}`);
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export const disconnectFromMongo = async () => {
  await mongoose.connection.close();
};
