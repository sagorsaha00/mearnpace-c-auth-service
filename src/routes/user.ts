import express from 'express'
import authenticate from '../../middleware/authenticate'
import { canAccess } from '../../middleware/canAccesse'
import { ROLES } from '../../constants'
import { UserController } from '../controllers/UserController'
import { UserService } from '../services/UserService'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import logger from '../config/logger'
import { AuthNumber } from '../types'

const router = express.Router()

const user = AppDataSource.getRepository(User)
const userService = new UserService(user)
const userController = new UserController(userService, logger)

router.post(
   '/',
   authenticate,
   canAccess([ROLES.ADMIN]),
   async (req, res, next) => await userController.create(req, res, next),
)
router.get('/', authenticate, canAccess([ROLES.ADMIN]), (req, res, next) =>
   userController.getAll(req, res, next),
)
router.get('/:id', authenticate, canAccess([ROLES.ADMIN]), (req, res, next) =>
   userController.getOne(req as AuthNumber, res, next),
)
router.delete(
   '/:id',
   authenticate,
   canAccess([ROLES.ADMIN]),
   (req, res, next) => {
      return userController.destroy(req, res, next)
   },
)

export default router
