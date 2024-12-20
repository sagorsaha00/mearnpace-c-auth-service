import { userdata } from './../types/index'
import { Repository } from 'typeorm'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'

export class UserService {
   // userRepository: any
   constructor(private userRepository: Repository<User>) {}

   async create({ firstname, lastname, email, password }: userdata) {
      {
         //  const userRepository = AppDataSource.getRepository(User)

         try {
            return await this.userRepository.save({
               firstname,
               lastname,
               email,
               password,
            })
         } catch (error) {
            throw error
         }
      }

      // const newUser = {
      //     id: 'generated-id', // Replace with logic to create or retrieve ID

      //   };
      //   return newUser
   }
}
