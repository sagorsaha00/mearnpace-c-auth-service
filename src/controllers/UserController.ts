import { Logger } from 'winston'
import { ROLES } from '../../constants'
import { createUserRepository, userQuryParams } from '../types'
import { UserService } from './../services/UserService'
import { Request, Response, NextFunction } from 'express'
import createHttpError from 'http-errors'
import { matchedData } from 'express-validator'

export class UserController {
   constructor(
      private userService: UserService,
      private logger: Logger,
   ) {}

   async create(req: createUserRepository, res: Response, next: NextFunction) {
      try {
         const { firstname, lastname, email, password, role } = req.body

         const user = await this.userService.create({
            firstname,
            lastname,
            email,
            password,
            role: role,
         })

         res.status(201).json({ id: user.id })
      } catch (error) {
         next(error)
      }
   }
   async getAll(req: Request, res: Response, next: NextFunction) {
      const validataquery = matchedData(req, { onlyValidData: true })

      try {
         const [users, count] = await this.userService.getAll(
            validataquery as userQuryParams,
         )

         this.logger.info('All users have been fetched')
         res.json({
            currentPage: validataquery.currentPage,
            perPage: validataquery.perPage,
            total: count,
            data: users,
         })
      } catch (err) {
         next(err)
      }
   }
   async getOne(req: Request, res: Response, next: NextFunction) {
      try {
         const userId = req.params.id

         if (!userId || isNaN(Number(userId))) {
            next(createHttpError(400, 'Invalid URL param.'))
            return
         }

         const user = await this.userService.getOne(Number(userId))

         if (!user) {
            next(createHttpError(404, 'User does not exist.'))
            return
         }

         res.status(200).json(user)
      } catch (err) {
         next(err)
      }
   }

   async destroy(req: Request, res: Response, next: NextFunction) {
      const userId = req.params.id

      if (isNaN(Number(userId))) {
         next(createHttpError(400, 'Invalid url param.'))
         return
      }

      try {
         await this.userService.deleteById(Number(userId))
         this.logger.info('User has been deleted', {
            id: Number(userId),
         })
         res.json({ id: Number(userId) })
      } catch (err) {
         next(err)
      }
   }
   async update(req: Request, res: Response, next: NextFunction) {
      try {
         const { firstname, lastname, email, role, tanentId } = req.body
         const userId = req.params.id

         // Validate userId
         if (!userId || isNaN(Number(userId))) {
            return next(createHttpError(400, 'Invalid User ID'))
         }

         const numericUserId = Number(userId)

         // Update user
         await this.userService.update(numericUserId, {
            firstname,
            lastname,
            email,
            role,
            tanentId,
         })

         // Return success response
         return res
            .status(200)
            .json({ message: 'User updated successfully', id: numericUserId })
      } catch (error) {
         next(error)
      }
   }
}
