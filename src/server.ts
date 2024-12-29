import { error } from 'console'
import app from './app'
import { Config } from './config'
import { AppDataSource } from './config/data-source'
import logger from './config/logger'

const startserver = async () => {
   const PORT = Config.PORT
   console.log('port name', Config.PORT)
   try {
      await AppDataSource.initialize()
      logger.info('databse connect successfully')
      app.listen(PORT, () => {
         logger.info(`server is running on port ${PORT}`)
      })
   } catch (err: unknown) {
      if (err instanceof Error) {
         logger.error(err.message)
         setTimeout(() => {
            process.exit(1)
         }, 1000)
      }
   }
}

startserver()
