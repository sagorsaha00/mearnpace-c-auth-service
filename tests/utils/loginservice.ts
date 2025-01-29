import bcrypt from 'bcrypt'

import createHttpError from 'http-errors'
function next(error: createHttpError.HttpError<404>) {
   throw new Error('Function not implemented.')
}
export class LoginService {
   private userRepository

   constructor(userRepository: any) {
      this.userRepository = userRepository
   }

   async login(email: string, password: string): Promise<number> {
      // const user = await this.userRepository.findOne({ where: { email }  })
      // const user = await this.userRepository.find({
      //    where: { email },
      //    select: ['password'], // Explicitly select the password field
      // });
      const user = await this.userRepository.findOne({
         where: { email },
         select: ['id', 'email', 'password'],
      })
      // console.log('user name ', user)
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
