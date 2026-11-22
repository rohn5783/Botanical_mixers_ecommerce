import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/aranya_botanicals'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  JWT_SECRET: z.string().default('aranya_botanicals_super_secure_jwt_secret_2026_botanicals_india'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string().default('aranya_refresh_secret_key_botanicals_secure_2026'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  RAZORPAY_KEY_ID: z.string().default('rzp_test_aranyaBotanicalsKey123'),
  RAZORPAY_KEY_SECRET: z.string().default('rzp_test_secretKeyAranya98765'),
  RAZORPAY_WEBHOOK_SECRET: z.string().default('aranya_webhook_secret_razorpay_2026'),
  CLOUDINARY_CLOUD_NAME: z.string().default('aranya-botanicals'),
  CLOUDINARY_API_KEY: z.string().default('123456789012345'),
  CLOUDINARY_API_SECRET: z.string().default('aranya_cloudinary_dummy_secret_abc'),
  RESEND_API_KEY: z.string().default('re_aranya_dummy_resend_api_key_test'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables detected:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
