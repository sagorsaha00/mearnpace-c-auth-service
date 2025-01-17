import bcript from 'bcrypt'
import { userdata } from './../types/index'
import { Repository } from 'typeorm'
import { User } from '../entity/User'
import { ROLES } from '../../constants'
import createHttpError from 'http-errors'

export class UserService {
   // userRepository: any
   constructor(private userRepository: Repository<User>) {}

   async create({ firstname, lastname, email, password, role }: userdata) {
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
            role,
         })
      } catch (error) {
         throw error
      }
   }

   async findByemailwithpassword(email: string) {
      return await this.userRepository.findOne({
         where: { email: email },
         select: ['id', 'email', 'firstname', 'lastname', 'password', 'role'],
      })
   }
   async findById(id: number) {
      return await this.userRepository.findOne({
         where: { id },
      })
   }

   async getAll() {
      return await this.userRepository.find()
   }
}
