import bcrypt from 'bcrypt'

export class LoginService {
   private userRepository

   constructor(userRepository: any) {
      this.userRepository = userRepository
   }

   async login(email: string, password: string): Promise<number> {
      const user = await this.userRepository.findOne({ where: { email } })
      console.log('user name ', user)
      if (!user) {
         throw new Error('Invalid email or password')
      }

      const passwordMatch = await bcrypt.compare(password, user.password)
      if (!passwordMatch) {
         throw new Error('Invalid password')
      }

      return 201 // Success
   }
}
