import express, { Request, Response } from 'express'
import { TanentControllers } from '../controllers/TanentControllers'
import { TanentService } from '../services/TanentService'
import { AppDataSource } from '../config/data-source'
import { Tenants } from '../entity/Tenant'
import logger from '../config/logger'
import authenticate from '../../middleware/authenticate'
import { canAccess } from '../../middleware/canAccesse'
import { ROLES } from '../../constants'

const router = express.Router()
const tanentRepository = AppDataSource.getRepository(Tenants)
const tanentService = new TanentService(tanentRepository)
const tanentController = new TanentControllers(tanentService, logger)

// router.post('/', authenticate, canAccess([ROLES.ADMIN]), (req, res) =>
//    tanentController.create(req, res),
// )
router.post(
   '/',
   authenticate,
   canAccess([ROLES.ADMIN]),
   (req: Request, res: Response) => {
      tanentController.create(req, res)
   },
)
// router.post('/',(req,res) => {
//    res.json({})
// })
export default router
