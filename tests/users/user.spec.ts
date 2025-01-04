import { body } from 'express-validator'
import createJWKSMock from 'mock-jwks'
import { ROLES } from './../../constants/index'
import { DataSource } from 'typeorm'
import app from '../../src/app'
import request from 'supertest'
import { AppDataSource } from '../../src/config/data-source'
import { JwtPayload } from 'jsonwebtoken'
import { User } from '../../src/entity/User'

describe('POST / auth/register', () => {
   let connection: DataSource
   let jwks: ReturnType<typeof createJWKSMock>
   beforeAll(async () => {
      jwks = createJWKSMock('https://localhost:3000')
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
      it('it shoud return 200 code', async () => {
         //genarate token
         const accessToken = jwks.token({
            sub: '1',
            role: ROLES.CUSTOMER,
         })
         const responce = await request(app)
            .get('/auth/self')
            .set('Cookie', `accessToken=${accessToken}`)
            .send()
         expect(responce.statusCode).toBe(200)
      })
      //new test
      it('it shoud return user data', async () => {
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

         // console.log('accesstoken', accessToken)
         // console.log('id number', data.id)
         //add token in cookie
         const responce = await request(app)
            .get('/auth/self')
            .set('Cookie', `accessToken=${accessToken};`)
            .send()

         //aserts
         // console.log('Response status:', responce.statusCode)
         // console.log('Response body:', responce.body)

         // Assert user data
         expect(responce.statusCode).toBe(200)
         //user data check if user data not match throw error
         expect(responce.body.id).toBe(data?.id)
      })
   })
})
