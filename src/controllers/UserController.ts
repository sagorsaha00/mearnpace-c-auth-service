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
   // async getOne(req: Request, res: Response, next: NextFunction) {
   //    try {
   //       const user = await this.userService.findById(Number(req.params.id))
   //      console.log('user',user);
   //       const { id } = req.params
   //       Simulate fetching user data
   //       const user = {
   //          id,
   //          firstname: 'Sagor',
   //          lastname: 'Saha',
   //          email: 'sahasagor659@gmail.com',
   //       }
   //       if (!user) {
   //          const error = createHttpError(
   //             400,
   //             'for you we do not found any user',
   //          )
   //          next(error)
   //       }
   //       this.logger.info('User has been fetched', { id: user?.id })
   //       res.json(user)
   //    } catch (error) {
   //       console.error('Error fetching user:', error)
   //       return res.status(500).json({ error: 'Internal server error' })
   //    }
   // }
   async getOne(req: Request, res: Response, next: NextFunction) {
      const userId = req.params.id
      console.log('Received userId:', userId)

      if (isNaN(Number(userId))) {
         console.log('Invalid userId format')
         next(createHttpError(400, 'Invalid url param.'))
         return
      }

      try {
         // Log the actual numeric ID we're searching for
         console.log('Searching for user with ID:', Number(userId))

         // Make sure we're using the correct method name from your service
         const user = await this.userService.findById(Number(userId))
         console.log('Database response:', user)

         if (!user) {
            console.log('No user found')
            next(createHttpError(404, 'User does not exist.')) // Changed to 404
            return
         }

         this.logger.info('User has been fetched', { id: user.id })

         // Explicitly send status with response
         res.status(200).json({
            ...user, // spread other user properties
         })
      } catch (err) {
         console.error('Error in getOne:', err)
         next(err)
      }
   }
}
