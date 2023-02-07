import cors from 'cors'
import express from 'express'
import compression from 'compression'
import { ClientConfig, Client } from '@line/bot-sdk'
import { DynamoDB } from 'aws-sdk'
import hookRouter from './routes/hookRouter'
import apiRouter from './routes/apiRouter'

const clientConfig: ClientConfig = {
  channelAccessToken: process.env.ACCESS_TOKEN!,
  channelSecret: process.env.CHANNEL_SECRET,
}
export const client = new Client(clientConfig)
export const dynamo = new DynamoDB.DocumentClient()

const allowedOrigins = [
  'https://main.digujj42u353j.amplifyapp.com/',
  'http://localhost:3000',
]
const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
}

const app = express()

app
  .use(compression())
  .use(cors(corsOptions))
  .use('/hook', hookRouter)
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use('/api', apiRouter)

export { app }
