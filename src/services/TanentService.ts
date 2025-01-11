import { Repository } from 'typeorm'
import { Itanent } from '../types'
import { Tenants } from '../entity/Tenant'

export class TanentService {
   constructor(private tanentRepository: Repository<Tenants>) {}
   async create(tanentData: Itanent) {
      return await this.tanentRepository.save(tanentData)
   }
}
