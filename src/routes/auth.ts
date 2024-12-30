import express, { NextFunction, Request, Response } from 'express'
import { AuthControllers } from './../controllers/AuthControllers'
import { UserService } from '../services/UserService'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import logger from '../config/logger'
import { body } from 'express-validator'
import { registerValidator } from '../validator/register-validator'
import { TokenService } from '../services/TokenService'
import { RefreshToken } from '../entity/RefreshToken'
import { loginValidator } from '../validator/login-validator'

const router = express.Router()
const userRepository = AppDataSource.getRepository(User)
const refreshtokenrepository = AppDataSource.getRepository(RefreshToken)
const userService = new UserService(userRepository)
const tokenservice = new TokenService(refreshtokenrepository)
const authControllers = new AuthControllers(userService, logger, tokenservice)

router.post(
   '/register',
   registerValidator, // Fixed validation method from isEmpty to notEmpty
   (req: Request, res: Response, next: NextFunction) =>
      authControllers.register(req, res, next),
)
router.post(
   '/login',
   loginValidator, // Fixed validation method from isEmpty to notEmpty
   (req: Request, res: Response, next: NextFunction) =>
      authControllers.register(req, res, next),
)

export default router
