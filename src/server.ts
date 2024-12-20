import app from './app'
import { Config } from './config'
import logger from './config/logger'

const startserver = () => {
   const PORT = Config.PORT

   try {
      app.listen(PORT, () => {
         logger.info(`server is running on port ${PORT}`)
      })
   } catch (error) {
      console.log(error)
   }
}
startserver()
