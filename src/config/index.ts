// import path from 'node:path'
// import * as dotenv from 'dotenv'
// import { config } from '../types'

// // Load environment variables first
// dotenv.config({
//    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'dev'}`),
// })

// export const Config: config = {
//    PORT: process.env.PORT || '5500',
//    NODE_ENV: process.env.NODE_ENV || 'development',
//    DB_HOST: process.env.DB_HOST || 'localhost',
//    DB_PORT: process.env.DB_PORT || '5432',
//    DB_PASSWORD: process.env.DB_PASSWORD || '',
//    DB_USERNAME: process.env.DB_USERNAME || '',
//    DB_NAME: process.env.DB_NAME || '',
//    JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
//    REFRESH_TOKEN_SECRET:
//       process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret',
//    JWKS_URI: process.env.JWKS_URI!,
//    PRIVATE_KEY: process.env.PRIVATE_KEY?.toString() ?? 'default_private_key',
// }

// src/types/config.ts
export interface config {
   PORT: string
   NODE_ENV: string
   DB_HOST: string
   DB_PORT: string
   DB_PASSWORD: string
   DB_USERNAME: string
   DB_NAME: string
   JWT_SECRET: string
   REFRESH_TOKEN_SECRET: string
   JWKS_URI: string
   PRIVATE_KEY: string
}

// src/config/index.ts
import path from 'node:path'
import * as dotenv from 'dotenv'
import * as types from '../types'

// Load environment variables first
const envFile = `.env.${process.env.NODE_ENV || 'dev'}`
const envPath = path.join(__dirname, `../../${envFile}`)

console.log(`Loading environment from: ${envPath}`)
dotenv.config({ path: envPath })

// Helper to ensure clean string values
const cleanEnvValue = (value: string | undefined): string => {
   return value?.trim().replace(/,+$/, '') || ''
}

export const Config: types.config = {
   PORT: cleanEnvValue(process.env.PORT) || '5500',
   NODE_ENV: cleanEnvValue(process.env.NODE_ENV) || 'development',
   DB_HOST: cleanEnvValue(process.env.DB_HOST) || 'localhost',
   DB_PORT: cleanEnvValue(process.env.DB_PORT) || '5432',
   DB_PASSWORD: cleanEnvValue(process.env.DB_PASSWORD) || 'root',
   DB_USERNAME: cleanEnvValue(process.env.DB_USERNAME) || 'root',
   DB_NAME: cleanEnvValue(process.env.DB_NAME) || 'mearstack_auth-service',
   JWT_SECRET: cleanEnvValue(process.env.JWT_SECRET) || 'default_jwt_secret',
   REFRESH_TOKEN_SECRET:
      cleanEnvValue(process.env.REFRESH_TOKEN_SECRET) ||
      'default_refresh_secret',
   JWKS_URI: cleanEnvValue(process.env.JWKS_URI) || '',
   PRIVATE_KEY: cleanEnvValue(process.env.PRIVATE_KEY) || 'default_private_key',
}

// Validate configuration
const validateConfig = () => {
   console.log('Current configuration:', {
      NODE_ENV: Config.NODE_ENV,
      DB_HOST: Config.DB_HOST,
      DB_PORT: Config.DB_PORT,
      DB_USERNAME: Config.DB_USERNAME,
      DB_NAME: Config.DB_NAME,
   })
}

validateConfig()
