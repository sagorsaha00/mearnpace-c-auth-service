import { Logger } from 'winston'
import { UserService } from '../services/UserService'
import { Response, Request, NextFunction } from 'express' // Correct import for Response and Request
import { validationResult } from 'express-validator'

export class AuthControllers {
   constructor(
      private userService: UserService,
      private logger: Logger,
   ) {}

   async register(request: Request, res: Response, next: NextFunction) {
      // Correctly typed request and res
      // if (
      //    !request.body.firstname ||
      //    !request.body.lastname ||
      //    !request.body.email ||
      //    !request.body.password
      // ) {
      //    return res.status(400).json({ message: 'All fields are required.' })
      // }

      const result = validationResult(request)
      if (!result.isEmpty()) {
         return res.status(400).json({ errors: result.array() })
      }

      const { firstname, lastname, email, password } = request.body
      this.logger.info('user has been registerd', {
         firstname,
         lastname,
         email,
         password: '#****',
      })

      try {
         const user = await this.userService.create({
            firstname,
            lastname,
            email,
            password,
         })
         this.logger.info('user has been registerd', { id: user.id })
         res.status(201).json({ id: user.id })
      } catch (err) {
         next(err)
         return
      }
   }
}
