import createJWKSMock from 'mock-jwks'
import request from 'supertest'
import { ROLES } from './../../constants/index'
import { DataSource } from 'typeorm'
import app from '../../src/app'
import { AppDataSource } from '../../src/config/data-source'
import { User } from '../../src/entity/User'

describe('POST / users', () => {
   let connection: DataSource
   let jwks: ReturnType<typeof createJWKSMock>

   beforeAll(async () => {
      jwks = createJWKSMock('http://localhost:5500')
      connection = await AppDataSource.initialize()
   })

   beforeEach(async () => {
      jwks.start()
      await connection.dropDatabase()
      await connection.synchronize()
   })

   afterAll(async () => {
      jwks.stop()
      if (connection && connection.isInitialized) {
         await connection.destroy()
      } else {
         console.log('Connection was not initialized, skipping cleanup')
      }
   })

   describe('given all field', () => {
      //new test
      it('should persist the user in the database', async () => {
         const adminToken = jwks.token({
            sub: '1',
            role: ROLES.ADMIN,
         })

         const userdata = {
            firstname: 'Sagor',
            lastname: 'saha',
            email: 'sahasagor659@gmail.com',
            password: 'secret',
            tanentId: 1,
         }

         const response = await request(app)
            .post('/auth/register')
            .set('Cookie', [`accessToken=${adminToken};`])
            .send(userdata)

         console.log('Response Status:', response.status)
         console.log('Response Body:', response.body)

         expect(response.status).toBe(201)

         const userRepository = connection.getRepository(User)
         const users = await userRepository.find()

         expect(users).toHaveLength(1)
         expect(users[0].email).toBe(userdata.email)
      })
      it('should create a manager user', async () => {
         const adminToken = jwks.token({
            sub: '1',
            role: ROLES.ADMIN,
         })

         const userdata = {
            firstname: 'Sagor',
            lastname: 'saha',
            email: 'sahasagor659@gmail.com',
            password: 'secret',
            tanentId: 1,
         }

         const response = await request(app)
            .post('/auth/register')
            .set('Cookie', [`accessToken=${adminToken};`])
            .send(userdata)

         expect(response.status).toBe(201)

         const userRepository = connection.getRepository(User)
         const users = await userRepository.find()

         expect(users).toHaveLength(1)
         expect(users[0].role).toBe(ROLES.MANAGER)
      })
   })
})
