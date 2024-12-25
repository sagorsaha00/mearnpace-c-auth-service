import { sign } from 'crypto'
import fs from 'fs'
import * as jwt from 'jsonwebtoken'
import { JwtPayload } from 'jsonwebtoken'
import { Logger } from 'winston'
import { UserService } from '../services/UserService'
import { Response, Request, NextFunction } from 'express' // Correct import for Response and Request
import { cookie, validationResult } from 'express-validator'
import { strict } from 'assert'
import path from 'path'
import createHttpError from 'http-errors'

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

         let privateKey: Buffer
         try {
            privateKey = fs.readFileSync(
               path.join(__dirname, '../../certs/privateKey.pem'),
            )
         } catch (err) {
            const error = createHttpError(500, 'Internal Server Error')
            next(error)
            return
         }

         const payload: JwtPayload = {
            sub: String(user.id), // The 'sub' claim (typically the user ID)
            role: user.role, // Your custom claim (role)
         }

         // Generate the access token
         const accessToken = jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1h',
            issuer: 'Auth-Service',
         })

         const refreshToken = 'fhfghgffddf'

         res.cookie('accessToken', accessToken, {
            domain: 'localhost',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
         })

         res.cookie('refreshToken', refreshToken, {
            domain: 'localhost',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
         })

         res.status(201).json({ id: user.id })
      } catch (err) {
         next(err)
         return
      }
   }
}
