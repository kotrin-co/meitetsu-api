import cors from "cors";
import express from "express";
import path from "path";
import compression from "compression";
import {
  ClientConfig,
  Client,
} from "@line/bot-sdk";
import { DynamoDB } from "aws-sdk";
import router from "./routes/router";

const clientConfig: ClientConfig = {
  channelAccessToken: process.env.ACCESS_TOKEN!,
  channelSecret: process.env.CHANNEL_SECRET,
};
export const client = new Client(clientConfig);
export const dynamo = new DynamoDB.DocumentClient();

const allowedOrigins = [
  "https://0d46nffa3e.execute-api.ap-northeast-1.amazonaws.com",
];
const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
};

const ejs = require("ejs").__express;
const app = express();

app.use(compression());
app.use(cors(corsOptions));
app.set("view engine", "ejs");
app.engine(".ejs", ejs);


app.set("views", path.join(__dirname, "views"));

app.use("/", router);

export { app };
