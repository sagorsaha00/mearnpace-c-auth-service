import { DataSource } from 'typeorm'

export const truncateTabels = async (connection: DataSource) => {
   const entitys = connection.entityMetadatas
   for (const entity of entitys) {
      const repository = connection.getRepository(entity.name)
      await repository.clear()
   }
}
