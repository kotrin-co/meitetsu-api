import "source-map-support/register";
import serverlessExpress from "@vendia/serverless-express";
import { app } from "./app";
import { birthWatcher } from "./birth-watcher";

export const handler = serverlessExpress({ app });

export { birthWatcher };
