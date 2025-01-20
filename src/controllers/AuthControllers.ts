// import { validateRegister } from './../validator/login-validator';
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
import { ROLES } from '../../constants'

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
            role: ROLES.CUSTOMER,
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

         //responce accesstoken
         res.cookie('accessToken', accessToken, {
            domain: 'localhost',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
         })

         //responce refreshtoken
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
         const user = await this.userService.findByemailwithpassword(email)

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
      const user = await this.userService.findById(Number(req.auth.sub))
      const { password, ...userWithoutPassword } = user || {}
      res.json(userWithoutPassword)
   }

   async refresh(req: AuthRequest, res: Response, next: NextFunction) {
      try {
         const payload: JwtPayload = {
            sub: String(req.auth.sub), // The 'sub' claim (typically the user ID)
            role: req.auth.role, // Your custom claim (role)
         }

         //genarate accesstoken
         const accessToken = this.tokenservice.genarateAccessToken(payload)

         const user = await this.userService.findById(Number(req.auth.sub))

         //user check
         if (!user) {
            const error = createHttpError(
               400,
               'user with the token could not be find',
            )
            next(error)
            return
         }

         //persists the refresh token
         const newrefreshtoken =
            await this.tokenservice.persistRefreshToken(user)

         //delete old refresh token
         await this.tokenservice.deleteRefreshToken(Number(req.auth.id))

         //refrehtoken genarate
         const refreshToken = this.tokenservice.genarateRefreshToken({
            ...payload,
            id: String(newrefreshtoken.id),
         })

         //responce accesstoken
         res.cookie('accessToken', accessToken, {
            domain: 'localhost',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
         })

         //responce refreshtoken
         res.cookie('refreshToken', refreshToken, {
            domain: 'localhost',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 365, //1y
            httpOnly: true,
         })

         res.status(201).json({ id: req.auth.sub })
      } catch (error) {
         next(error)
         return
      }
   }

   async logout({
      req,
      res,
      next,
   }: {
      req: AuthRequest
      res: Response
      next: NextFunction
   }) {
      try {
         // Check if auth exists
         if (!req.auth || !req.auth.id) {
            return res.status(401).json({
               error: 'No authentication token found',
            })
         }

         await this.tokenservice.deleteRefreshToken(Number(req.auth.id))

         // Clear cookies with specific options
         res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
         })

         res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
         })

         return res.status(200).json({ message: 'Logged out successfully' })
      } catch (error) {
         next(error)
      }
   }
}
