import { checkSchema } from 'express-validator'

export const loginValidator = checkSchema({
   email: {
      isEmail: {
         errorMessage: 'A valid email is required',
      },
      notEmpty: {
         errorMessage: 'Email is required',
      },
      trim: true, // Trims spaces before validation
   },
   password: {
      notEmpty: {
         errorMessage: 'Password is required',
      },
   },
})
