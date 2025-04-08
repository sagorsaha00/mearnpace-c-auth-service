import { checkSchema } from 'express-validator'
import { CustomRequest } from '../types'

export const updatelistuservalidator = checkSchema({
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
      trim: true,
   },
   role: {
      notEmpty: {
         errorMessage: 'Role is required',
      },
      trim: true,
   },
   tanent: {
    
      trim: true,
      custom: {
         options: (value: string, { req }) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const role = req.body.role
            console.log(!value);
            if (role === 'admin') {
               return true // Admins can skip tanentId
            } else {
               return !value
            }
             
         },
      },
   },
})
