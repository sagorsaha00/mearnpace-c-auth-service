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
