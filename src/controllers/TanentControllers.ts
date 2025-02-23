import { NextFunction, Request, Response } from 'express'
import { TanentService } from '../services/TanentService'
import { createTenantRepository, resutantParams } from '../types'
import { Logger } from 'winston'
import { matchedData } from 'express-validator'

export class TanentControllers {
   constructor(
      private tanentservice: TanentService,

      private logger: Logger,
   ) {}
   async create(req: createTenantRepository, res: Response) {
      const { name, address } = req.body

      const tanent = await this.tanentservice.create({ name, address })
      this.logger.info('tanent has been create', { id: tanent.id })
      res.status(201).json({ id: tanent.id })
   }
   async getAll(req: Request, res: Response, next: NextFunction) {
       const resturantQury = matchedData(req, { onlyValidData: true })
      
      try {
         // Fetch all tenants from the database
         const [tenants ,count] = await this.tanentservice.getAll(resturantQury as resutantParams);

         // Log the action
         this.logger.info("Fetched all tenant data successfully.");

         // Send JSON response
         return res.status(200).json({
            success: true,
            message: "All tenants fetched successfully.",
            data: tenants,
            total:count,
            currentPage:resturantQury.currentPage,
            perPage:resturantQury.perPage,
         });
      } catch (error) {
         this.logger.error("Error fetching tenants: "  );
         next(error);
      }
   }
}
