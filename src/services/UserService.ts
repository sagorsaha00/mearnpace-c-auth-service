import bcript from 'bcrypt'
import { userdata } from './../types/index'
import { Repository } from 'typeorm'
import { User } from '../entity/User'

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

      return await this.userRepository.save({
         firstname,
         lastname,
         email,
         password: HasPassword,
         role,
      })
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
   async getOne(id: number): Promise<User | null> {
      return await this.userRepository.findOne({ where: { id } })
   }
   async deleteById(userId: number) {
      return await this.userRepository.delete(userId)
   }
}
