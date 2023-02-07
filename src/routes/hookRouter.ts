import express, { Request, Response } from 'express'
import linebot from '../controllers/hook'
import { middleware, MiddlewareConfig } from '@line/bot-sdk'

const middlewareConfig: MiddlewareConfig = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET!,
}

const hookRouter = express.Router()

// LINE Webhook
hookRouter.post(
  '/',
  middleware(middlewareConfig),
  (req: Request, res: Response) => linebot(req, res)
)

export default hookRouter
