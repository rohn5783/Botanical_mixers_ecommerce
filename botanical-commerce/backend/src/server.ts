import app from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { seedDatabaseIfEmpty } from './utils/seedDatabase.js';
import path from 'path';
import fs from 'fs';
import express from 'express';

const PORT = env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('[Server] Connecting to MongoDB database...');
    await connectDatabase();

    // Auto seed database if empty so dev/demo has rich realistic data immediately
    await seedDatabaseIfEmpty();

    // Serve static frontend build if present
    const possibleStaticDirs = [
      path.resolve(process.cwd(), '../frontend/out'),
      path.resolve(process.cwd(), 'frontend/out'),
      path.resolve(process.cwd(), '../frontend/public'),
      path.resolve(process.cwd(), 'public'),
    ];
    const staticDir = possibleStaticDirs.find((d) => fs.existsSync(d));

    if (staticDir) {
      console.log(`[Frontend] Serving static web assets from: ${staticDir}`);
      app.use(express.static(staticDir));
      app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
          return next();
        }
        res.sendFile(path.join(staticDir, 'index.html'));
      });
    }

    const server = app.listen(PORT, () => {
      console.log(`🌿 Aranya Botanicals running on port ${PORT} [${env.NODE_ENV}]`);
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
