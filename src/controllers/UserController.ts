import { ROLES } from '../../constants'
import { createUserRepository } from '../types'
import { UserService } from './../services/UserService'
import { Request, Response, NextFunction } from 'express'

export class UserController {
   constructor(private userService: UserService) {}

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
}
