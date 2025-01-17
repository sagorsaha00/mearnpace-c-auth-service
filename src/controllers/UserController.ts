import { error } from 'console'
import { Logger } from 'winston'
import { ROLES } from '../../constants'
import { createUserRepository } from '../types'
import { UserService } from './../services/UserService'
import { Request, Response, NextFunction } from 'express'
import createHttpError from 'http-errors'

export class UserController {
   constructor(
      private userService: UserService,
      private logger: Logger,
   ) {}

   async create(req: createUserRepository, res: Response, next: NextFunction) {
      try {
         const { firstname, lastname, email, password } = req.body

         const user = await this.userService.create({
            firstname,
            lastname,
            email,
            password,
            role: ROLES.MANAGER,
         })

         res.status(201).json({ id: user.id })
      } catch (error) {
         next(error)
      }
   }
   async getAll(req: Request, res: Response, next: NextFunction) {
      try {
         const users = await this.userService.getAll()

         this.logger.info('All users have been fetched')
         res.json(users)
      } catch (err) {
         next(err)
      }
   }
}
