import express, {
   NextFunction,
   Request,
   RequestHandler,
   Response,
} from 'express'
import { AuthControllers } from './../controllers/AuthControllers'
import { UserService } from '../services/UserService'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import logger from '../config/logger'

import { registerValidator } from '../validator/register-validator'
import { TokenService } from '../services/TokenService'
import { RefreshToken } from '../entity/RefreshToken'
import { loginValidator } from '../validator/login-validator'
import { credentialService } from '../services/credentialService'
import authenticate from '../../middleware/authenticate'
import { AuthRequest } from '../types'
import validateRefreshToken from '../../middleware/validateRefreshToken'
import perseRefreshToken from '../../middleware/perseRefreshToken'

const router = express.Router()
const userRepository = AppDataSource.getRepository(User)
const refreshtokenrepository = AppDataSource.getRepository(RefreshToken)
const userService = new UserService(userRepository)
const tokenservice = new TokenService(refreshtokenrepository)
const credentialservice = new credentialService()
const authControllers = new AuthControllers(
   userService,
   logger,
   tokenservice,
   credentialservice,
)

router.post(
   '/register',
   registerValidator, // Fixed validation method from isEmpty to notEmpty
   (req: Request, res: Response, next: NextFunction) =>
      authControllers.register(req, res, next) as unknown as RequestHandler,
)
router.post(
   '/login',
   loginValidator, // Fixed validation method from isEmpty to notEmpty
   (req: Request, res: Response, next: NextFunction) =>
      authControllers.login(req, res, next) as unknown as RequestHandler,
)
router.get(
   '/self',
   authenticate as RequestHandler, // Fixed validation method from isEmpty to notEmpty
   (req: Request, res: Response) =>
      authControllers.self(
         req as AuthRequest,
         res,
      ) as unknown as RequestHandler,
)
router.post(
   '/refresh',
   validateRefreshToken as RequestHandler, // Fixed validation method from isEmpty to notEmpty
   (req: Request, res: Response, next: NextFunction) =>
      authControllers.refresh(
         req as AuthRequest,
         res,
         next,
      ) as unknown as RequestHandler,
)
router.post(
   '/logout',
   authenticate as RequestHandler,
   perseRefreshToken as RequestHandler, // Fixed validation method from isEmpty to notEmpty,
   (req: Request, res: Response, next: NextFunction) =>
      authControllers.logout({
         req: req as AuthRequest,
         res,
         next,
      }) as unknown as RequestHandler,
)
export default router
