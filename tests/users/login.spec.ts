import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import { User } from '../../src/entity/User'
import { ROLES } from '../../constants'
import { LoginService } from '../utils/loginservice'
import bcrypt from 'bcrypt'

describe('POST / auth/login', () => {
   let connection: DataSource

   beforeAll(async () => {
      connection = await AppDataSource.initialize()
   })

   beforeEach(async () => {
      await connection.dropDatabase()
      // console.log('Database dropped.')

      await connection.synchronize()
      // console.log('Database synchronized.')

      // console.log('Test user added.')
   })

   afterAll(async () => {
      if (connection && connection.isInitialized) {
         await connection.destroy()
      } else {
         // console.log('Connection was not initialized, skipping cleanup')
      }
   })

   describe('given all field', () => {
      it('should return 201 if email and password is valid', async () => {
         const hashedPassword = await bcrypt.hash('password', 10) // Hash the password

         await connection.getRepository(User).save({
            firstname: 'Test',
            lastname: 'User',
            email: 'sahasagor620@gmail.com',
            password: hashedPassword, // Save the hashed password
            role: ROLES.CUSTOMER,
         })
         // const users = await userRepository.find({select:["password"]})
         const result = await new LoginService(
            connection.getRepository(User),
         ).login('sahasagor620@gmail.com', 'password')

         expect(result).toBe(201)
      })
   })
})
