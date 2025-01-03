import { expressjwt, GetVerificationKey } from 'express-jwt'
import { expressJwtSecret, Headers } from 'jwks-rsa'
import { Config } from '../src/config'
import { Request } from 'express'
import { authcookie } from '../src/types'

export default expressjwt({
   secret: expressJwtSecret({
      jwksUri: Config.JWKS_URI,
      cache: true,
      rateLimit: true,
   }) as GetVerificationKey,
   algorithms: ['RS256'],
   getToken(req: Request) {
      const authHeader = req.headers.authorization
      if (authHeader && authHeader.split('')[1] !== 'undefined') {
         const token = authHeader.split('')[1]
         if (token) {
            return token
         }
      }

      const { accessToken } = req.cookies as authcookie
      return accessToken
   },
})
