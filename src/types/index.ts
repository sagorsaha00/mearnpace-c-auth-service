import { Request } from 'express'

export interface userdata {
   firstname: string
   lastname: string
   email: string
   password: string
}
export interface RegisterUserRepository extends Request {
   body: userdata
}
export interface authcookie {
   accessToken: string
   refreshToken: string
}
export interface IrefreeshToken {
   id: string
}
export interface AuthRequest extends Request {
   auth: {
      sub: number
      role: number
      id: number
   }
}
export interface config {
   PORT: string
   NODE_ENV: string
   DB_HOST: string
   DB_PORT: string
   DB_PASSWORD: string
   DB_USERNAME: string
   DB_NAME: string
   JWT_SECRET: string
   REFRESH_TOKEN_SECRET: string
   JWKS_URI: string
}
