import { Response } from 'express'
import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import request from 'supertest'
import app from '../../src/app'
import { Tenants } from '../../src/entity/Tenant'
import exp from 'constants'
import createJWKSMock from 'mock-jwks'
import { ROLES } from '../../constants'

describe('POST /tanents', () => {
   let connection: DataSource
   let jwks: ReturnType<typeof createJWKSMock>
   let adminToken: string
   beforeAll(async () => {
      jwks = createJWKSMock('http://localhost:5500')
      connection = await AppDataSource.initialize()
   })

   beforeEach(async () => {
      jwks.start()
      await connection.dropDatabase()
      await connection.synchronize()

      adminToken = jwks.token({
         sub: '1',
         role: ROLES.ADMIN,
      })
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
      it('shoud 201 status code', async () => {
         const tanantdata = {
            name: 'tanent name',
            address: 'tanent addess',
         }
         const responce = await request(app)
            .post('/tanents')
            .set('Cookie', [`accessToken=${adminToken};`])
            .send(tanantdata)

         expect(responce.statusCode).toBe(201)
      })
      it('should create a tanent in database', async () => {
         const tanantdata = {
            name: 'tanent name',
            address: 'tanent addess',
         }
         await request(app)
            .post('/tanents')
            .set('Cookie', [`accessToken=${adminToken};`])
            .send(tanantdata)

         const tanentRepository = connection.getRepository(Tenants)
         const tanents = await tanentRepository.find()
         expect(tanents).toHaveLength(1)
         expect(tanents[0].name).toBe(tanantdata.name)
         expect(tanents[0].address).toBe(tanantdata.address)
      })
      it('should not create a tanent database without authnatecate', async () => {
         const tanantdata = {
            name: 'tanent name',
            address: 'tanent addess',
         }
         const response = await request(app).post('/tanents').send(tanantdata)

         expect(response.statusCode).toBe(401)

         const tanentRepository = connection.getRepository(Tenants)
         const tanents = await tanentRepository.find()
         expect(tanents).toHaveLength(0)
      })
      it('should throw 403 if user not admin and dont have any permisson', async () => {
         const tanantdata = {
            name: 'tanent name',
            address: 'tanent addess',
         }
         const RolesToken = jwks.token({
            sub: '1',
            role: ROLES.MANAGER,
         })
         const response = await request(app)
            .post('/tanents')
            .set('Cookie', [`accessToken=${RolesToken};`])
            .send(tanantdata)

         expect(response.statusCode).toBe(403)

         const tanentRepository = connection.getRepository(Tenants)
         const tanents = await tanentRepository.find()
         expect(tanents).toHaveLength(0)
      })
   })
})
