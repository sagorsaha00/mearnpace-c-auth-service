import express from 'express'
import authenticate from '../../middleware/authenticate'
import { canAccess } from '../../middleware/canAccesse'
import { ROLES } from '../../constants'
import { UserController } from '../controllers/UserController'
import { UserService } from '../services/UserService'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'

const router = express.Router()
const user = AppDataSource.getRepository(User)
const userService = new UserService(user)
const userController = new UserController(userService)

router.post('/', authenticate, canAccess([ROLES.ADMIN]), (req, res, next) =>
   userController.create(req, res, next),
)
export default router
