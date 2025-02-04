import { RequestHandler } from 'express'
import path from 'node:path'
// import 'reflect-metadata'
// import { DataSource } from 'typeorm'
// import { Config } from '.'

// console.log("DB_PASSWORD:", Config.DB_PASSWORD)
// export const AppDataSource = new DataSource({
//    type: 'postgres',
//    host: Config.DB_HOST,
//    port: Number(Config.DB_PORT),
//    username: Config.DB_USERNAME,
//    password: (Config.DB_PASSWORD),
//    database: Config.DB_NAME,
//    synchronize: false,
//    logging: Config.NODE_ENV === 'development',
//    entities: [path.join(__dirname, '../entity/*.{js,ts}')],
//    migrations: [path.join(__dirname, '../migration/*.{js,ts}')],
//    subscribers: [],

// })

import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Config } from '.'

export const AppDataSource = new DataSource({
   type: 'postgres',
   host: Config.DB_HOST,
   port: Number(Config.DB_PORT),
   username: Config.DB_USERNAME,
   password: Config.DB_PASSWORD,
   database: Config.DB_NAME,
   // Don't use this in production. Always keep false
   synchronize: false,
   logging: false,
   entities: ['src/entity/*.ts'],
   migrations: ['src/migration/*.ts'],
   subscribers: [],
})
