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
  'http://localhost:3000',
  'https://main.d3foe3m2eoatxa.amplifyapp.com', // dev
  'https://www.dev.memolin.meicomds.com', // dev
  'https://main.d479j7ev99tum.amplifyapp.com', // prd
  'https://www.management.memolin.meicomds.com', // prd
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
