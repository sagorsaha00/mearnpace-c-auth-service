import { NextFunction, Request, Response } from 'express'
import { AuthRequest } from '../src/types'
import createHttpError from 'http-errors'
import { ROLES } from '../constants'

export const canAccess = (roles: string[]) => {
   return (req: Request, res: Response, next: NextFunction) => {
      const _req = req as AuthRequest
      const rolefromtoken = _req.auth.role
      if (!roles.includes(rolefromtoken)) {
         const error = createHttpError(403, 'you are not enough permisson')
         next(error)
      }
      next()
   }
}
