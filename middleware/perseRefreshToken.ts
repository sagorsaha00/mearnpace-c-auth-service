import { authcookie, IrefreeshToken } from './../src/types/index'
import { expressjwt } from 'express-jwt'
import { Config } from '../src/config'
import { Request } from 'express'
export default expressjwt({
   secret: Config.REFRESH_TOKEN_SECRET!,
   algorithms: ['HS256'], // add this line

   getToken(req: Request) {
      const { refreshToken } = req.cookies as authcookie
      return refreshToken
   },
})
