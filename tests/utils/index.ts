import { DataSource } from 'typeorm'

export const truncateTabels = async (connection: DataSource) => {
   const entitys = connection.entityMetadatas
   for (const entity of entitys) {
      const repository = connection.getRepository(entity.name)
      await repository.clear()
   }
}

export const jtwt = (token: string | null): boolean => {
   if (token === null) {
      return false
   }

   const parts = token.split('.')

   if (parts.length !== 3) {
      return false
   }

   try {
      parts.forEach((part) => {
         Buffer.from(part, 'base64').toString('utf-8')
      })
      return true
   } catch (error) {
      return false
   }
}
