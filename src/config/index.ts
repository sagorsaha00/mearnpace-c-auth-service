// import path from "node:path";
// import * as dotenv from "dotenv";

//  const {PORT,NODE_ENV,DB_HOST,DB_PORT,DB_PASSWORD,DB_USERNAME,DB_NAME } = process.env;
//  console.log("Loaded Environment Variables:", process.env);

// // config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });
// dotenv.config({
//     path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || "dev"}`),
// });

// export const Config = {
//     PORT,
//     NODE_ENV,
//     DB_HOST,DB_PORT,DB_PASSWORD,DB_USERNAME,DB_NAME
// }

import path from 'node:path'
import * as dotenv from 'dotenv'

// Load environment variables first
dotenv.config({
   path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`),
})

// const {
//    PORT,
//    NODE_ENV,
//    DB_HOST,
//    DB_PORT,
//    DB_PASSWORD,
//    DB_USERNAME,
//    DB_NAME,
//    REFRESH_TOKEN_SECRET,
// } = process.env

// export const Config = {
//    PORT,
//    NODE_ENV,
//    DB_HOST,
//    DB_PORT,
//    DB_PASSWORD,
//    DB_USERNAME,
//    DB_NAME,
//    REFRESH_TOKEN_SECRET,
// }

// config/index.ts
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
}

export const Config: config = {
   PORT: process.env.PORT || '3000',
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
}

// Debugging: Log to verify values
// console.log(Config)
