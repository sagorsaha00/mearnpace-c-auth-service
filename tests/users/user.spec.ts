import createJWKSMock from 'mock-jwks'
import { ROLES } from './../../constants/index'
import { DataSource } from 'typeorm'
import app from '../../src/app'
import request from 'supertest'
import { AppDataSource } from '../../src/config/data-source'
import { User } from '../../src/entity/User'

describe('POST / auth/self', () => {
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
      if (connection?.isInitialized) {
         await connection.destroy()
      } else {
         console.log('Connection was not initialized, skipping cleanup')
      }
   })

   describe('given all field', () => {
      it('it shoud return 200 code', async () => {
         //genarate token
         const accessToken = jwks.token({
            sub: '1',
            role: ROLES.CUSTOMER,
         })
         const responce = await request(app)
            .get('/auth/self')
            .set('Cookie', [`accessToken=${accessToken};`])
            .send()

         expect(responce.statusCode).toBe(200)
      })
      //new test
      it('it shoud return user data', async () => {
         // Register user
         const userdata = {
            firstname: 'Sagor',
            lastname: 'saha',
            email: 'sahasagor659@gmail.com',
            password: 'secret',
         }

         const userRepository = connection.getRepository(User)
         const data = await userRepository.save({
            ...userdata,
            role: ROLES.CUSTOMER,
         })

         const accessToken = jwks.token({
            sub: data.id.toString(),
            role: data.role,
         })
         const responce = await request(app)
            .get('/auth/self')
            .set('Cookie', [`accessToken=${accessToken};`])
            .send()
         interface ResponseBody {
            id: number
         }

         expect(responce.statusCode).toBe(200)
         expect((responce.body as ResponseBody).id).toBe(data.id)
      })

      it('it shoud not return user password', async () => {
         //register user
         const userdata = {
            firstname: 'Sagor',
            lastname: 'saha',
            email: 'sahasagor659@gmail.com', // Valid email
            password: 'secret',
         }

         const userRepository = connection.getRepository(User)
         const data = await userRepository.save({
            ...userdata,
            role: ROLES.CUSTOMER,
         })
         //genarate token
         const accessToken = jwks.token({
            sub: data.id.toString(),
            role: data.role,
         })
         //add token in cookie
         const responce = await request(app)
            .get('/auth/self')
            .set('Cookie', [`accessToken=${accessToken};`])
            .send()

         // Assert user data

         //user data check if user data not match throw error
         expect(responce.body).not.toHaveProperty('password')
      })
      it('it shoud return 401 if token does not exists', async () => {
         //register user
         const userdata = {
            firstname: 'Sagor',
            lastname: 'saha',
            email: 'sahasagor659@gmail.com', // Valid email
            password: 'secret',
         }

         const userRepository = connection.getRepository(User)
         await userRepository.save({
            ...userdata,
            role: ROLES.CUSTOMER,
         })

         //add token in cookie
         const responce = await request(app).get('/auth/self').send()

         // Assert user data

         expect(responce.statusCode).toBe(401)
      })
   })
})
