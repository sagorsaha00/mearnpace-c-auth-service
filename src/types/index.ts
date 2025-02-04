import { Request } from 'express'

export interface userdata {
   firstname: string
   lastname: string
   email: string
   password: string
   role: string
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
export interface AuthNumber extends Request {
   auth: {
      id: string
   }
}
export interface AuthRequest extends Request {
   auth: {
      sub: string
      role: string
      id: string
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
   PRIVATE_KEY: string
}

export interface Itanent {
   name: string
   address: string
}

export interface createTenantRepository extends Request {
   body: Itanent
}
export interface createUserRepository extends Request {
   body: userdata
}
// interface getUserdata extends Request {
//    params: {
//       id?: string
//       firstname?: string
//       lastname?: string
//       email?: string
//    }
// }
