import express, { NextFunction, Request, Response } from 'express'
import { TanentControllers } from '../controllers/TanentControllers'
import { TanentService } from '../services/TanentService'
import { AppDataSource } from '../config/data-source'
import { Tenants } from '../entity/Tenant'
import logger from '../config/logger'
import authenticate from '../../middleware/authenticate'
import { canAccess } from '../../middleware/canAccesse'
import { ROLES } from '../../constants'
import { listResturantValidator } from '../validator/list-resturant-validator'

const router = express.Router()
const tanentRepository = AppDataSource.getRepository(Tenants)
const tanentService = new TanentService(tanentRepository)
const tanentController = new TanentControllers(tanentService, logger)

router.post(
   '/',
   authenticate,
   canAccess([ROLES.ADMIN]),
   (req: Request, res: Response) => {
      tanentController.create(req, res)
   },
)
router.get(
   "/alltanents",
   // authenticate,  // Middleware for authentication
   // canAccess([ROLES.ADMIN, ROLES.MANAGER]), 
   listResturantValidator,
   // Role-based access
   (req: Request, res: Response, next: NextFunction) => tanentController.getAll(req, res, next) // FIX: Call getAll()
);

export default router
