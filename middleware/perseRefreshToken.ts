import { expressjwt } from 'express-jwt'
import { Config } from '../src/config'
import { Request } from 'express'
import { authcookie } from './../src/types/index'

const parseRefreshToken = expressjwt({
   secret: Config.REFRESH_TOKEN_SECRET,
   algorithms: ['HS256'],
   credentialsRequired: true,
   requestProperty: 'auth',
   getToken: (req: Request) => {
      try {
         const cookies = req.cookies as authcookie
         return cookies?.refreshToken
      } catch (error) {
         error
         return undefined
      }
   },
})

export default parseRefreshToken
