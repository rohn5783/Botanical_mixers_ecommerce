import mongoose from 'mongoose';
import { env } from './env.js';

let mongodInstance: any = null;

export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true);

    // Attempt connecting to the configured MONGODB_URI first
    try {
      const conn = await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`[MongoDB] Connected to database: ${conn.connection.host}/${conn.connection.name}`);
      return;
    } catch (primaryErr: any) {
      console.warn(`[MongoDB] Standard URI connection failed (${primaryErr.message}). Initiating embedded MongoDB engine for seamless development/testing...`);
    }

    // Dynamic import of mongodb-memory-server to run zero-setup in-memory database
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const uri = mongodInstance.getUri();
    const memoryConn = await mongoose.connect(uri);
    console.log(`[MongoDB] Embedded in-memory MongoDB started successfully at ${uri}`);
  } catch (error) {
    console.error('[MongoDB] Critical database initialization failure:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
      console.log('[MongoDB] Embedded in-memory MongoDB stopped.');
    }
  } catch (error) {
    console.error('[MongoDB] Error during disconnect:', error);
  }
};
