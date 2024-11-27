import { HttpError } from 'http-errors'
/* eslint-disable @typescript-eslint/no-unsafe-call */
import express, { NextFunction, Request, Response } from 'express'
import logger from './config/logger'

const app = express()
app.get('/', (req, res) => {
   res.send('Hello World!')
})

//global error-handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
   logger.error(err.message)
   const statuscode = err.statusCode || 500

   res.status(statuscode).json({
      errors: [
         {
            type: err.name,
            message: err.message,
            path: '',
         },
      ],
   })
})
export default app
