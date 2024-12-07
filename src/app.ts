import "reflect-metadata"
import express,{ NextFunction, Request, Response,Express } from 'express'
import { HttpError } from 'http-errors'
import authRouter from './routes/auth'
import logger from './config/logger'

const app: Express = express()

app.get('/', (req, res) => {
   res.send('Hello World!')
})
app.use('/auth',authRouter);

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
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
export default app as Express
