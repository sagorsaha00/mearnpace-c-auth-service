import express, { NextFunction, Request, Response } from 'express'
import { AuthControllers } from './../controllers/AuthControllers'
import { UserService } from '../services/UserService'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import logger from '../config/logger'
import registerValidator from '../validator/register-validator'
import { body } from 'express-validator'

const router = express.Router()
const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)
const authControllers = new AuthControllers(userService, logger)

router.post(
   '/register',
   registerValidator, // Fixed validation method from isEmpty to notEmpty
   (req: Request, res: Response, next: NextFunction) =>
      authControllers.register(req, res, next),
)

export default router
