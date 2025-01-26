import createHttpError from 'http-errors'
import * as jwt from 'jsonwebtoken'

import { JwtPayload } from 'jsonwebtoken'
import { Config } from '../config'
import { User } from '../entity/User'
import { AppDataSource } from '../config/data-source'
import { RefreshToken } from '../entity/RefreshToken'
import { Repository } from 'typeorm'
export class TokenService {
   constructor(private refreshtokenrepository: Repository<RefreshToken>) {}

   genarateAccessToken(payload: JwtPayload) {
      let privateKey: string

      if (!Config.PRIVATE_KEY) {
         const error = createHttpError(500, 'SECRET_KEY not set')
         throw error
      }
      try {
         privateKey = Config.PRIVATE_KEY
      } catch (err) {
         const error = createHttpError(500, 'Internal Server Error')
         throw error
      }
      const accessToken = jwt.sign(payload, privateKey, {
         algorithm: 'RS256',
         expiresIn: '1h',
         issuer: 'Auth-Service',
      })
      return accessToken
   }
   genarateRefreshToken(payload: JwtPayload) {
      //   console.log(payload);
      const refreshToken = jwt.sign(payload, Config.REFRESH_TOKEN_SECRET!, {
         algorithm: 'HS256',
         expiresIn: '1y',
         issuer: 'Auth-Service',
         jwtid: String(payload.id),
      })
      return refreshToken
   }
   async persistRefreshToken(user: User) {
      const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365 // 1 year
      //  const refreshtokenrepo = AppDataSource.getRepository(RefreshToken)
      const newrefreshtoken = await this.refreshtokenrepository.save({
         user: user,
         expriseAt: new Date(Date.now() + MS_IN_YEAR),
      })
      return newrefreshtoken
   }
   async deleteRefreshToken(tokenId: number) {
      await this.refreshtokenrepository.delete({ id: tokenId })
   }
}
