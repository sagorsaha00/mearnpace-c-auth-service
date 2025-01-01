import { body } from 'express-validator'
import { ROLES } from './../../constants/index'
import { DataSource } from 'typeorm'
import app from '../../src/app'
import request from 'supertest'
import { AppDataSource } from '../../src/config/data-source'
import { User } from '../../src/entity/User'
import { jtwt, truncateTabels } from '../utils'
import { Headers } from 'jwks-rsa'
import { RefreshToken } from '../../src/entity/RefreshToken'

describe('POST / auth/register', () => {
   let connection: DataSource

   beforeAll(async () => {
      connection = await AppDataSource.initialize()
   })

   beforeEach(async () => {
      await connection.dropDatabase()
      await connection.synchronize()
   })

   afterAll(async () => {
      if (connection && connection.isInitialized) {
         await connection.destroy()
      } else {
         console.log('Connection was not initialized, skipping cleanup')
      }
   })

   describe('given all field', () => {
      it('it shoud return 200 code', async () => {
         const responce = await request(app).get('/auth/self').send()
         expect(responce.statusCode).toBe(200)
      })
   })
})
