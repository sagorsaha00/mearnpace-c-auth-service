import 'reflect-metadata'
import { Config } from '.'
import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
   type: 'postgres',
   host: 'localhost',
   port: Number(Config.DB_PORT),
   username: 'root',
   password: 'root', // Explicit string conversion//v
   database: 'mearstack_auth-service',
   //dont-touch in production alawaya keep false
   synchronize: false,
   logging: false,
   entities: ['src/entity/*.{ts,js}'],
   migrations: ['src/migration/*.{ts,js}'],
   subscribers: [],
})
