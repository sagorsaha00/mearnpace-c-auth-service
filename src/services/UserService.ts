import bcript from 'bcrypt'
import { userdata } from './../types/index'
import { Repository } from 'typeorm'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import { ROLES } from '../../constants'
import createHttpError from 'http-errors'

export class UserService {
   // userRepository: any
   constructor(private userRepository: Repository<User>) {}

   async create({ firstname, lastname, email, password }: userdata) {
      //already email exists
      const user = await this.userRepository.findOne({
         where: { email: email },
      })
      if (user) {
         const err = createHttpError(400, 'email already use another user')
         throw err
      }

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
