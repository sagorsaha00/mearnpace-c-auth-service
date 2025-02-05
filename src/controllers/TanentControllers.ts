import { Response } from 'express'
import { TanentService } from '../services/TanentService'
import { createTenantRepository } from '../types'
import { Logger } from 'winston'

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
}
