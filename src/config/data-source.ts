// import 'reflect-metadata'
// import { Config } from '.'
// import { DataSource } from 'typeorm'
// console.log('congig',Config.DB_NAME);

// export const AppDataSource = new DataSource({
//    type: 'postgres',
//    host: 'localhost',
//    port: Number(Config.DB_PORT),
//    username: 'root',
//    password: 'root', // Explicit string conversion//v
//    database: 'mearstack_auth-service',
//    //dont-touch in production alawaya keep false
//    synchronize: false,
//    logging: false,
//    entities: ['src/entity/*.{ts,js}'],
//    migrations: ['src/migration/*.{ts,js}'],
//    subscribers: [],
// })

// src/config/data-source.ts
import path from 'node:path'
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
   synchronize: false,
   logging: Config.NODE_ENV === 'development',
   entities: [path.join(__dirname, '../entity/*.{js,ts}')],
   migrations: [path.join(__dirname, '../migration/*.{js,ts}')],
   subscribers: [],
})

export const initializeDatabase = async () => {
   try {
      if (!AppDataSource.isInitialized) {
         await AppDataSource.initialize()
         console.log('Database connection established successfully')
      }
      return AppDataSource
   } catch (error) {
      console.error('Database connection failed:', error)
      throw error
   }
}
