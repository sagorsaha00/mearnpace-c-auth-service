import 'reflect-metadata'
import express, { NextFunction, Request, Response, Express } from 'express'
import cookieParser from 'cookie-parser'
import { HttpError } from 'http-errors'
import authRouter from './routes/auth'
import logger from './config/logger'
import tanentRouter from './routes/tanent'
import userRouter from './routes/user'
const app = express()
app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser())
app.get('/', (req, res) => {
   res.send('Hello World!')
})
app.use('/auth', authRouter)
app.use('/tanents', tanentRouter)
app.use('/users', userRouter)

//global error-handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
   logger.error(err.message)
   const statuscode = err.statusCode || err.status || 500

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
