import { body } from 'express-validator'

export default body('email').isEmail().withMessage('A valid email is required')
