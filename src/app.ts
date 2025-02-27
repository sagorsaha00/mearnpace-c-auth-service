import 'reflect-metadata'
import express, { NextFunction, Request, Response, Express } from 'express'
import cookieParser from 'cookie-parser'
import { HttpError } from 'http-errors'
import cors from 'cors'
import authRouter from './routes/auth'
import logger from './config/logger'
import tanentRouter from './routes/tanent'
import userRouter from './routes/user'
import { globalErrorHandler } from '../middleware/globalerrorHandler'

const app = express()
app.use(
   cors({
      origin: ['http://localhost:5173'],
      credentials: true,
   }),
)
app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser())
app.get('/', (req, res) => {
   res.send('Hello World!')
})
app.use('/auth', authRouter)
app.use('/tenents', tanentRouter)
app.use('/users', userRouter)

//global error-handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(globalErrorHandler)
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
export default app as Express
