import path from 'node:path'
import * as dotenv from 'dotenv'
import { config } from '../types'

// Load environment variables first
dotenv.config({
   path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'dev'}`),
})

export const Config: config = {
   PORT: process.env.PORT || '5500',
   NODE_ENV: process.env.NODE_ENV || 'development',
   DB_HOST: process.env.DB_HOST || 'localhost',
   DB_PORT: process.env.DB_PORT || '5432',
   DB_PASSWORD: process.env.DB_PASSWORD || '',
   DB_USERNAME: process.env.DB_USERNAME || '',
   DB_NAME: process.env.DB_NAME || '',
   JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
   REFRESH_TOKEN_SECRET:
      process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret',
   JWKS_URI: process.env.JWKS_URI!,
   PRIVATE_KEY: process.env.PRIVATE_KEY?.toString() ?? 'default_private_key',
}
