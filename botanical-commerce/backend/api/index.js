import app from '../dist/app.js';
import { connectDatabase } from '../dist/config/database.js';

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    try {
      await connectDatabase();
      isConnected = true;
    } catch (err) {
      console.error('[Vercel Serverless] DB connection error:', err);
    }
  }
  return app(req, res);
}
