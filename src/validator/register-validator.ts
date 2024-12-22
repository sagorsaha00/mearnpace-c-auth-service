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

// })

// const { body, validationResult } = require('express-validator');

//  export const validateRegister = [
//    body('firstname').notEmpty().withMessage('Firstname is required'),
//    body('lastname').notEmpty().withMessage('Lastname is required'),
//    body('email').isEmail().withMessage('Valid email is required'),
//    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
//    (req:Request, res:Response, next:NextFunction) => {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//          return res.status(400).json({ errors: errors.array() });
//       }
//       next();
//    },
// ];

// export default body('email').isEmail().withMessage('A valid email is required')
