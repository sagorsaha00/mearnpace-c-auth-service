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
