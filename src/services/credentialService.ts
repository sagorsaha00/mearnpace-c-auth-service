import bcrypt from 'bcrypt'
export class credentialService {
   async comparePassword(userpassword: string, passwordHash: string) {
      return await bcrypt.compare(userpassword, passwordHash)
   }
}
