import { Request, Response } from "express";
import { WebhookEvent } from "@line/bot-sdk";
import { handleTextEvent } from "./eventHandlers/handleMessageEvent";
import handleFollowEvent from "./eventHandlers/handleFollowEvent";
// import handlePostbackEvent from "./eventHandlers/handlePostbackEvent";

const linebot = async (req: Request, res: Response): Promise<void> => {
  const events: WebhookEvent[] = req.body.events;
  await Promise.all(
    events.map(async (event: WebhookEvent): Promise<void> => {
      try {
        switch (event.type) {
          case "follow":
            await handleFollowEvent(event);
            break;
          case "message":
            await handleTextEvent(event);
            break;
          // case "postback":
          //   await handlePostbackEvent(event);
          //   break;
        }
      } catch (error) {
        console.log(error);
      }
    })
  );
  res.status(200).end();
};

export default linebot;
