import mongoose from 'mongoose';
import { env } from './env.js';

let mongodInstance: any = null;

export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true);

    // Attempt connecting to the configured MONGODB_URI first
    try {
      const conn = await mongoose.connect(env.MONGODB_URI, {
        dbName: 'aranya_botanicals',
        serverSelectionTimeoutMS: 15000,
      });
      console.log(`🌿 [MongoDB] Connected to database: ${conn.connection.host}/${conn.connection.name}`);
      return;
    } catch (primaryErr: any) {
      console.warn(`[MongoDB] Primary connection failed (${primaryErr.message}).`);
      if (env.MONGODB_URI.includes('mongodb+srv://') || !env.MONGODB_URI.includes('localhost')) {
        console.warn(`[MongoDB] Atlas Connection Notice: Please verify that:
  1. Your current IP is whitelisted in MongoDB Atlas (Network Access -> Add IP -> 0.0.0.0/0 or Current IP).
  2. Database user credentials in .env are correct.
  3. Outgoing TLS connections on port 27017 are not blocked by firewall.`);
      }
      console.warn(`[MongoDB] Initiating embedded MongoDB engine for seamless development/testing...`);
    }

    // Dynamic import of mongodb-memory-server to run zero-setup in-memory database
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const uri = mongodInstance.getUri();
    const memoryConn = await mongoose.connect(uri, {
      dbName: 'aranya_botanicals',
    });
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
