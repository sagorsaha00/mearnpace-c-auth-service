import { AuthRequest } from './../types/index'
import { error } from 'console'
import { TokenService } from './../services/TokenService'
import fs from 'fs'
import * as jwt from 'jsonwebtoken'
import { JwtPayload } from 'jsonwebtoken'
import { Logger } from 'winston'
import { UserService } from '../services/UserService'
import { Response, Request, NextFunction } from 'express' // Correct import for Response and Request
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'

import { credentialService } from '../services/credentialService'

export class AuthControllers {
   constructor(
      private userService: UserService,
      private logger: Logger,
      private tokenservice: TokenService,
      private credentialservice: credentialService,
   ) {}

   async register(request: Request, res: Response, next: NextFunction) {
      //check valdator
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

      //user create
      try {
         const user = await this.userService.create({
            firstname,
            lastname,
            email,
            password,
         })
         this.logger.info('user has been registerd', { id: user.id })

         const payload: JwtPayload = {
            sub: String(user.id), // The 'sub' claim (typically the user ID)
            role: user.role, // Your custom claim (role)
         }

         //genarate accesstoken
         const accessToken = this.tokenservice.genarateAccessToken(payload)

         const newrefreshtoken =
            await this.tokenservice.persistRefreshToken(user)

         const refreshToken = this.tokenservice.genarateRefreshToken({
            ...payload,
            id: String(newrefreshtoken.id),
         })

         res.cookie('accessToken', accessToken, {
            domain: 'localhost',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
         })

         res.cookie('refreshToken', refreshToken, {
            domain: 'localhost',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 365, //1y
            httpOnly: true,
         })

         res.status(201).json({ id: user.id })
      } catch (err) {
         next(err)
         return
      }
   }
   async login(request: Request, res: Response, next: NextFunction) {
      //check valdator
      const result = validationResult(request)
      if (!result.isEmpty()) {
         return res.status(400).json({ errors: result.array() })
      }

      const { email, password } = request.body

      //user email check if email aldredy here throw error for user
      try {
         const user = await this.userService.findoneByemail(email)

         if (!user) {
            const error = createHttpError(404, 'password and email doest match')
            next(error)
            return
         }

         //user password check if user passeord and  input passwrod not match throw error function

         const passwrodMatch = await this.credentialservice.comparePassword(
            password,
            user.password,
         )

         if (!passwrodMatch) {
            const error = createHttpError(404, 'password and email doest match')
            next(error)
            return
         }
         this.logger.info('user has been login', { id: user.id })
         //this code is ok for login page
         const payload: JwtPayload = {
            sub: String(user.id), // The 'sub' claim (typically the user ID)
            role: user.role, // Your custom claim (role)
         }

         //genarate accesstoken
         const accessToken = this.tokenservice.genarateAccessToken(payload)

         const newrefreshtoken =
            await this.tokenservice.persistRefreshToken(user)

         const refreshToken = this.tokenservice.genarateRefreshToken({
            ...payload,
            id: String(newrefreshtoken.id),
         })

         res.cookie('accessToken', accessToken, {
            domain: 'localhost',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
         })

         res.cookie('refreshToken', refreshToken, {
            domain: 'localhost',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 365, //1y
            httpOnly: true,
         })

         res.json({ id: user.id })
      } catch (err) {
         next(err)
         return
      }
   }
   async self(req: AuthRequest, res: Response) {
      // console.log('Decoded token:', req.auth) // Assuming the middleware sets req.auth
      // console.log('Fetching user with ID:', req.auth?.sub)

      const user = await this.userService.findById(Number(req.auth?.sub))
      res.json(user)
   }
}
