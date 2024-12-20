import { DataSource } from 'typeorm'
import app from '../../src/app'
import request from 'supertest'
import { AppDataSource } from '../../src/config/data-source'
import { User } from '../../src/entity/User'
import { truncateTabels } from '../utils'
import { ROLE } from '../../constants'

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
      it('should return the 201 status code', async () => {
         //AAA
         //arage
         const userdata = {
            firstname: 'Sagor',
            lastname: 'saha',
            email: 'sahasagor650@gmail.com',
            password: 'secret',
         }
         //act
         const responce = await request(app)
            .post('/auth/register')
            .send(userdata)

         //assent
         expect(responce.statusCode).toBe(201)
      })

      it('its shoud return valid json', async () => {
         const userdata = {
            firstname: 'Sagor',
            lastname: 'saha',
            email: 'sahasagor650@gmail.com',
            password: 'secret',
         }
         //act
         const responce = await request(app)
            .post('/auth/register')
            .send(userdata)

         //assent application/jsonutf-8
         expect(
            (responce.headers as Record<string, string>)['content-type'],
         ).toEqual(expect.stringContaining('json'))
      })

      it('its shoud  persist the user data', async () => {
         const userdata = {
            firstname: 'Sagor',
            lastname: 'saha',
            email: 'sahasagor650@gmail.com',
            password: 'secret',
         }
         //act
         await request(app).post('/auth/register').send(userdata)

         //assent application/jsonutf-8
         const userRepository = connection.getRepository(User)
         const users = await userRepository.find()
         expect(users).toHaveLength(1)
      })
      it('its shoud assign a customer a role ', async () => {
         const userdata = {
            firstname: 'Sagor',
            lastname: 'saha',
            email: 'sahasagor650@gmail.com',
            password: 'secret',
         }
         //act
         await request(app).post('/auth/register').send(userdata)

         //assent application/jsonutf-8
         const userRepository = connection.getRepository(User)
         const users = await userRepository.find()
         console.log('users', users)

         expect(users[0]).toHaveProperty('role')
         expect(users[0].role).toBe(ROLES.CUSTOMER)
      })
   })
})
