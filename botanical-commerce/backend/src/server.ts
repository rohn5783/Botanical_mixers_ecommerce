import app from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { seedDatabaseIfEmpty } from './utils/seedDatabase.js';
import path from 'path';
import fs from 'fs';
import next from 'next';

const PORT = env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('[Server] Connecting to MongoDB database...');
    await connectDatabase();

    // Auto seed database if empty so dev/demo has rich realistic data immediately
    await seedDatabaseIfEmpty();

    // Integrate Next.js frontend if available
    const possibleFrontendDirs = [
      path.resolve(process.cwd(), '../frontend'),
      path.resolve(process.cwd(), 'frontend'),
    ];
    const frontendDir = possibleFrontendDirs.find(
      (d) => fs.existsSync(d) && fs.existsSync(path.join(d, 'package.json'))
    );

    if (frontendDir) {
      console.log(`[Frontend] Initializing Next.js from: ${frontendDir}`);
      const isDev = env.NODE_ENV === 'development' && !fs.existsSync(path.join(frontendDir, '.next'));
      const nextApp = (next as any)({ dev: isDev, dir: frontendDir });
      await nextApp.prepare();
      const nextHandler = nextApp.getRequestHandler();

      app.all('*', (req, res) => nextHandler(req, res));
      console.log('✨ [Frontend] Next.js integrated into unified Express server.');
    } else {
      console.log('[Frontend] Frontend directory not detected. Running API standalone.');
    }

    const server = app.listen(PORT, () => {
      console.log(`🌿 Aranya Botanicals running on port ${PORT} [${env.NODE_ENV}]`);
      console.log(`   Unified Store & Web UI: http://localhost:${PORT}`);
      console.log(`   API Base URL: http://localhost:${PORT}/api/v1`);
      console.log(`   Healthcheck: http://localhost:${PORT}/health`);
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
