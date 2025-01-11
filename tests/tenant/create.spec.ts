import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import request from 'supertest'
import app from '../../src/app'

describe('POST /tanents', () => {
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
      it('shoud 201 status code', async () => {
         const tanantdata = {
            name: 'tanent name',
            address: 'tanent addess',
         }
         const responce = await request(app).post('/tanents').send(tanantdata)

         expect(responce.statusCode).toBe(201)
      })
   })
})
