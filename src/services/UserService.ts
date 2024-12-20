import bcript from 'bcrypt'
import { userdata } from './../types/index'
import { Repository } from 'typeorm'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import { ROLES } from '../../constants'

export class UserService {
   // userRepository: any
   constructor(private userRepository: Repository<User>) {}

   async create({ firstname, lastname, email, password }: userdata) {
      //hash password create
      const saltOrRound = 10
      const HasPassword = await bcript.hash(password, saltOrRound)

      try {
         return await this.userRepository.save({
            firstname,
            lastname,
            email,
            password: HasPassword,
            role: ROLES.CUSTOMER,
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
