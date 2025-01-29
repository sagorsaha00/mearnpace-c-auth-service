import { authcookie, IrefreeshToken } from './../src/types/index'
import { expressjwt } from 'express-jwt'
import { Config } from '../src/config'
import { Request } from 'express'
import { AppDataSource } from '../src/config/data-source'
import { RefreshToken } from '../src/entity/RefreshToken'

import logger from '../src/config/logger'
export default expressjwt({
   secret: Config.REFRESH_TOKEN_SECRET,
   algorithms: ['HS256'], // add this line

   getToken(req: Request) {
      const { refreshToken } = req.cookies as authcookie
      return refreshToken
   },
   async isRevoked(request: Request, token) {
      try {
         const refreshTokenRepo = AppDataSource.getRepository(RefreshToken)
         const refrehToken = await refreshTokenRepo.findOne({
            where: {
               id: Number((token?.payload as IrefreeshToken).id),
               user: { id: Number(token?.payload.sub) },
            },
         })
         return refrehToken === null
      } catch (error) {
         logger.error('error white geting refresh token', {
            id: (token?.payload as IrefreeshToken).id,
         })
      }
      return true
   },
})
