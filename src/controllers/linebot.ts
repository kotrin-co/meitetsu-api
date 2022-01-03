import {Request, Response} from "express";
import {
  WebhookEvent,
} from "@line/bot-sdk";
import {handleTextEvent} from "../funcs/handleMessageEvent";
import handleFollowEvent from "../funcs/handleFollowEvent";

const linebot = async (req: Request, res: Response): Promise<void> => {
  const events: WebhookEvent[] = req.body.events;
  const results = await Promise.all(
    events.map(async (event: WebhookEvent): Promise<void> => {
      try {
        switch (event.type) {
          case "follow":
            await handleFollowEvent(event);
            break;
          case "message":
            await handleTextEvent(event);
            break;
        }
      } catch (error) {
        console.log(error);
      }
    })
  );
  res.status(200).json({
    status: "success",
    results
  });
};

export default linebot;
