import { error } from 'console'
import app from './app'
import { Config } from './config'
import { AppDataSource } from './config/data-source'
import logger from './config/logger'

const startserver = async () => {
   const PORT = Config.PORT
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

// import { error } from 'console'
// import app from './app'
// import { Config } from './config'
// import { AppDataSource } from './config/data-source'
// import logger from './config/logger'
// import https from 'https'
// import fs from 'fs'
// import path from 'path'

// const startserver = async () => {
//    const PORT = Config.PORT

//    // SSL Configuration
//    const sslOptions = {
//      key: fs.readFileSync(path.join(__dirname, '../certs/key.pem')),
//      cert: fs.readFileSync(path.join(__dirname, '../certs/cert.pem'))
//    }

//    try {
//       await AppDataSource.initialize()
//       logger.info('database connected successfully')

//       // Create HTTPS server
//       const server = https.createServer(sslOptions, app)

//       server.listen(PORT, () => {
//          logger.info(`server is running on port ${PORT}`)
//       })
//    } catch (err: unknown) {
//       if (err instanceof Error) {
//          logger.error(err.message)
//          setTimeout(() => {
//             process.exit(1)
//          }, 1000)
//       }
//    }
// }

// // Generate certificates if needed
// const generateCerts = () => {
//   const certsDir = path.join(__dirname, '../certs')
//   if (!fs.existsSync(certsDir)) {
//     fs.mkdirSync(certsDir)
//   }
// }

// generateCerts()
// startserver()
