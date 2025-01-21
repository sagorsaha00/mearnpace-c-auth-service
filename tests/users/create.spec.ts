import createJWKSMock from 'mock-jwks'
import { ROLES } from './../../constants/index'
import { DataSource } from 'typeorm'
import app from '../../src/app'
import request from 'supertest'
import { AppDataSource } from '../../src/config/data-source'
import { User } from '../../src/entity/User'

describe('POST / users', () => {
   let connection: DataSource
   let jwks: ReturnType<typeof createJWKSMock>

   beforeAll(async () => {
      jwks = createJWKSMock('http://localhost:5500')
      connection = await AppDataSource.initialize()
      const userRepository = connection.getRepository(User)
      await userRepository.save({
         id: 1,
         firstname: 'Test',
         lastname: 'User',
         email: 'sahasagor620@gmail.com',
         role: 'customer',
      })
   })

   beforeEach(async () => {
      jwks.start()
      await connection.dropDatabase()
      await connection.synchronize()
   })

   afterEach(() => {
      jwks.stop()
   })

   afterAll(async () => {
      await connection.destroy()
   })

   describe('given all field', () => {
      it('should persist the user in the database', async () => {
         const adminToken = jwks.token({
            sub: '1',
            role: 'admin',
         })

         // Register user
         const userdata = {
            firstname: 'Sagor',
            lastname: 'saha',
            email: 'sahasagor650@gmail.com',
            password: 'secret',
         }

         // Add token to cookie
         await request(app)
            .post('/users')
            .set('Cookie', [`accessToken=${adminToken}`])
            .send(userdata)

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
            role: ROLES.MANAGER,
         }

         const response = await request(app)
            .post('/users')
            .set('Cookie', [`accessToken=${adminToken};`])
            .send(userdata)

         expect(response.status).toBe(201)

         const userRepository = connection.getRepository(User)
         const users = await userRepository.find({})

         expect(users).toHaveLength(1)
         expect(users[0].role).toBe(ROLES.MANAGER)
      })
      it('should return list of users as a admin', async () => {
         // First create a user
         const userData = {
            firstname: 'Sagor',
            lastname: 'saha',
            email: 'sahasagor659@gmail.com',
            password: 'secret',
            tenantId: 1,
            role: ROLES.ADMIN, // Include role directly in the initial data
         }

         // Save user to database
         const userRepository = connection.getRepository(User)
         const savedUser = await userRepository.save({ ...userData })

         // Create token with ADMIN role (not CUSTOMER) since the route requires ADMIN access
         const adminToken = jwks.token({
            sub: savedUser.id.toString(), // Use the actual saved user ID
            role: ROLES.ADMIN, // Change to ADMIN role to match route requirements
         })

         // Get the users list
         const response = await request(app)
            .get('/users')
            .set('Cookie', [`accessToken=${adminToken}`])

         // Remove .send() as GET requests typically don't have a body

         // Add more specific assertions
         expect(response.status).toBe(200)
         expect(Array.isArray(response.body)).toBe(true)
         expect(response.body).toHaveLength(1)

         // Add assertions to verify the returned user data
         expect(response.body).toEqual([
            {
               id: savedUser.id, // Include the ID as it's part of the received response
               firstname: userData.firstname,
               lastname: userData.lastname,
               email: userData.email,
               role: userData.role,
            },
         ])
      })

      // Add test for unauthorized access
      it('should return 403 for non-admin users', async () => {
         const customerToken = jwks.token({
            sub: '1',
            role: ROLES.CUSTOMER,
         })

         const response = await request(app)
            .get('/users')
            .set('Cookie', [`accessToken=${customerToken}`])
            .send()

         expect(response.status).toBe(403)
      })

      it('should return 200 if get user id', async () => {
         // Create test user
         const userRepository = connection.getRepository(User)
         const user = await userRepository.create({
            firstname: 'John',
            lastname: 'Doe',
            email: 'johndoe@gmail.com',
            password: 'hashedpassword',
            role: 'customer',
         })
         await userRepository.save(user)
         const adminToken = jwks.token({
            sub: '1',
            role: ROLES.ADMIN,
         })

         // Fetch user by ID
         const response = await request(app)
            .get(`/users/${user.id}`)
            .set('Cookie', [`accessToken=${adminToken}`])
            .expect(200)

         expect(response.body).toHaveProperty('id', user.id)
      })
      it('should return 200 when deleting an existing user', async () => {
         // Create test user
         const userRepository = connection.getRepository(User)
         const user = await userRepository.create({
            firstname: 'John',
            lastname: 'Doe',
            email: 'johndoe@gmail.com',
            password: 'hashedpassword',
            role: 'customer',
         })
         await userRepository.save(user)

         // Generate token with appropriate role
         const accessToken = jwks.token({
            sub: '1',
            role: ROLES.ADMIN,
         })

         // Make the DELETE request
         const response = await request(app)
            .delete(`/users/${user.id}`)
            .set('Cookie', [`accessToken=${accessToken};`])

         console.log('response-body', response.body)
         console.log('response-statuscode', response.status)

         // Assertions
         expect(response.status).toBe(200)
         expect(response.body).toHaveProperty('id', user.id)
      })
   })
})
