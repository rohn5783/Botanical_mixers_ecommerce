import app from '../src/app.js';
import { connectDatabase } from '../src/config/database.js';

let isConnected = false;

export default async function handler(req: any, res: any) {
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
