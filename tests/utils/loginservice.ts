import bcrypt from 'bcrypt'

import createHttpError from 'http-errors'
function next(error: createHttpError.HttpError<404>) {
   throw new Error('Function not implemented.')
}
export class LoginService {
   private userRepository

   constructor(userRepository: unknown) {
      this.userRepository = userRepository
   }

   async login(email: string, password: string): Promise<number> {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const user = await this.userRepository.findOne({
         where: { email },
         select: ['id', 'email', 'password'],
      })

      if (!user) {
         const error = createHttpError(404, 'user and password are not match')
         next(error)
         return 404
      }

      const passwordMatch = await bcrypt.compare(password, user.password)
      if (!passwordMatch) {
         const error = createHttpError(404, 'user and password are not match')
         next(error)
         return 404
      }

      return 201 // Success
   }
}
