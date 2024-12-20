import express from 'express'
import { AuthControllers } from './../controllers/AuthControllers'
import { UserService } from '../services/UserService'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import logger from '../config/logger'

const router = express.Router()
const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)
const authControllers = new AuthControllers(userService, logger)

router.post('/register', (res, req, next) =>
   authControllers.register(res, req, next),
)

export default router
