import { ROLES } from './../../constants/index'
import { DataSource } from 'typeorm'
import app from '../../src/app'
import request from 'supertest'
import { AppDataSource } from '../../src/config/data-source'
import { User } from '../../src/entity/User'
import { truncateTabels } from '../utils'

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
         // console.log('users', users)

         expect(users[0]).toHaveProperty('role')
         expect(users[0].role).toBe(ROLES.CUSTOMER)
      })
      it('its shoud be hash password ', async () => {
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
         expect(users[0].password).not.toBe(userdata.password)
         expect(users[0].password).toHaveLength(60)
         expect(users[0].password).toMatch(/^\$2b\$\d+\$/)
      })

      it('its shoud return 404 if email already have axists', async () => {
         const userdata = {
            firstname: 'Sagor',
            lastname: 'saha',
            email: 'sahasagor650@gmail.com',
            password: 'secret',
         }

         const userRepository = connection.getRepository(User)
         await userRepository.save({ ...userdata, role: ROLES.CUSTOMER })

         const users = await userRepository.find()
         //act
         const responce = await request(app)
            .post('/auth/register')
            .send(userdata)
         expect(responce.statusCode).toBe(400)
         expect(users).toHaveLength(1)
      })
   })
   describe('given all field', () => {
      it('should return the 400 status code if fields are required', async () => {
         const userdata = {
            firstname: 'Sagor',
            lastname: 'saha',
            email: '',
            password: 'secret',
         }

         //act
         const responce = await request(app)
            .post('/auth/register')
            .send(userdata)
         expect(responce.statusCode).toBe(400)
      })
      it('should return the 400 status code if firstname field is empty', async () => {
         const userdata = {
            firstname: '', // Empty firstname
            lastname: 'saha',
            email: 'sahasagor650@gmai.com',
            password: 'secret',
         }

         const response = await request(app)
            .post('/auth/register')
            .send(userdata)

         expect(response.statusCode).toBe(400)
         expect(response.body.errors).toEqual(
            expect.arrayContaining([
               expect.objectContaining({ msg: 'Firstname is required' }),
            ]),
         )
      })
   })
   describe('given all field format properly', () => {
      it('should save the user if email is valid', async () => {
         const userdata = {
            firstname: 'Sagor',
            lastname: 'saha',
            email: 'sahasagor659@gmail.com', // Valid email
            password: 'secret',
         }

         // Act: Send the request
         const response = await request(app)
            .post('/auth/register')
            .send(userdata)

         // Assert: Ensure the response status is 201 (user created)
         expect(response.statusCode).toBe(201)

         // Verify user was saved to the database
         const userRepository = connection.getRepository(User)
         const users = await userRepository.find()

         // Assert: There should be one user
         expect(users.length).toBe(1)

         // Assert: User's email matches the input
         const user = users[0]
         expect(user.email).toBe('sahasagor659@gmail.com')
      })
   })
})
