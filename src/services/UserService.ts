import * as bcrypt from 'bcrypt' // Make sure this import exists
import { userdata, userQuryParams } from './../types/index'
import { Brackets, Repository } from 'typeorm'
import { User } from '../entity/User'

import createHttpError from 'http-errors'

export class UserService {
   // userRepository: any
   constructor(private userRepository: Repository<User>) {}

   async create(userData: userdata) {
      const { firstname, lastname, email, password, role } = userData

      // Check if email already exists
      const existingUser = await this.userRepository.findOne({
         where: { email },
      })
      if (existingUser) {
         throw createHttpError(400, 'Email is already in use by another user')
      }

      if (!password) {
         throw createHttpError(400, 'password is required')
      }
      // Hash the password
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      // Create and save the new user
      const newUser = this.userRepository.create({
         firstname,
         lastname,
         email,
         password: hashedPassword,
         role,
      })

      return await this.userRepository.save(newUser)
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
         relations: {
            tanent: true,
         },
      })
   }

   async getAll(validataquery: userQuryParams) {
      const quryBuilder = this.userRepository.createQueryBuilder('user')

      if (validataquery.q) {
         const searchItem = `%${validataquery.q}%`
         quryBuilder.where(
            new Brackets((qb) => {
               qb.where(
                  "CONCAT(user.firstname, ' ', user.lastname) ILike :q ",
                  { q: searchItem },
               ).orWhere('user.email ILike :q', { q: searchItem })
            }),
         )
      }
      if (validataquery.role) {
         quryBuilder.andWhere('user.role = :role', {
            role: validataquery.role,
         })
      }

      const result = await quryBuilder
         .leftJoinAndSelect('user.tanent', 'tanent')
         .skip((validataquery.currentPage - 1) * validataquery.perPage)
         .take(validataquery.perPage)
         .orderBy('user.id', 'DESC')
         .getManyAndCount()

      return result
   }
   async getOne(id: number): Promise<User | null> {
      return await this.userRepository.findOne({ where: { id } })
   }
   async deleteById(userId: number) {
      return await this.userRepository.delete(userId)
   }
}
