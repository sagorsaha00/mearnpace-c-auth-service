import 'reflect-metadata'
import { Config } from '.'
import { DataSource } from 'typeorm'
import { User } from '../entity/User'
import { config } from 'dotenv'
import { RefreshToken } from '../entity/RefreshToken'

export const AppDataSource = new DataSource({
   type: 'postgres',
   host: 'localhost',
   port: Number(Config.DB_PORT),
   username: 'root',
   password: 'root', // Explicit string conversion
   database: 'mearstack_auth-service',
   //dont-touch in production alawaya keep false
   synchronize: false,
   logging: false,
   entities: [User, RefreshToken],
   migrations: ['src/migration/*.ts'],
   subscribers: [],
})
