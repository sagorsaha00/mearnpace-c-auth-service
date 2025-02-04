import { checkSchema } from 'express-validator'

export const registerValidator = checkSchema({
   firstname: {
      notEmpty: {
         errorMessage: 'Firstname is required',
      },
      trim: true,
   },
   lastname: {
      notEmpty: {
         errorMessage: 'Lastname is required',
      },
      trim: true,
   },
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
      isLength: {
         options: { min: 6 },
         errorMessage: 'Password must be at least 6 characters long',
      },
      notEmpty: {
         errorMessage: 'Password is required',
      },
   },
})
