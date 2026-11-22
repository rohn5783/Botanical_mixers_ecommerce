import app from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { seedDatabaseIfEmpty } from './utils/seedDatabase.js';

const PORT = env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('[Server] Connecting to MongoDB database...');
    await connectDatabase();

    // Auto seed database if empty so dev/demo has rich realistic data immediately
    await seedDatabaseIfEmpty();

    const server = app.listen(PORT, () => {
      console.log(`🌿 Aranya Botanicals API listening on port ${PORT} [${env.NODE_ENV}]`);
      console.log(`   Healthcheck: http://localhost:${PORT}/health`);
      console.log(`   API Base: http://localhost:${PORT}/api/v1`);
    });

    const shutdown = async (signal: string) => {
      console.log(`[Server] Received ${signal}. Gracefully shutting down...`);
      server.close(() => {
        console.log('[Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('[Server] Critical startup error:', error);
    process.exit(1);
  }
};

startServer();
