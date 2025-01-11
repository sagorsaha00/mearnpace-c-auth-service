import express from 'express'
import { TanentControllers } from '../controllers/TanentControllers'
import { TanentService } from '../services/TanentService'
import { AppDataSource } from '../config/data-source'
import { Tenants } from '../entity/Tenant'
import logger from '../config/logger'
import authenticate from '../../middleware/authenticate'

const router = express.Router()
const tanentRepository = AppDataSource.getRepository(Tenants)
const tanentService = new TanentService(tanentRepository)
const tanentController = new TanentControllers(tanentService, logger)

router.post('/', authenticate, (req, res) => tanentController.create(req, res))
export default router
