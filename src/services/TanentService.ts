import { registerValidator } from './../validator/register-validator'
import { Brackets, Repository } from 'typeorm'
import { Itanent, resutantParams } from '../types'
import { Tenants } from '../entity/Tenant'
import { NextFunction, Request, Response } from 'express'

export class TanentService {
   constructor(private tanentRepository: Repository<Tenants>) {}
   async create(tanentData: Itanent) {
      return await this.tanentRepository.save(tanentData)
   }
   async getAll(resturantQury: resutantParams) {
      const resturantBuilder =
         this.tanentRepository.createQueryBuilder('tanents')

      if (resturantQury.r) {
         const searchItem = `%${resturantQury.r}%`
         resturantBuilder.where(
            new Brackets((qb) => {
               qb.where(
                  "CONCAT(tanents.name, ' ', tanents.address) ILike :r ",
                  {
                     r: searchItem,
                  },
               )
            }),
         )
      }

      const result = await resturantBuilder
         .skip((resturantQury.currentPage - 1) * resturantQury.perPage)
         .take(resturantQury.perPage)
         .orderBy('tanents.id', 'DESC')
         .getManyAndCount()

      return result
   }
}
