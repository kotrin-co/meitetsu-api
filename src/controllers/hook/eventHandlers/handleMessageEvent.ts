import { MessageEvent } from "@line/bot-sdk";
import { client } from "../../../app";

export const handleTextEvent = async (event: MessageEvent) => {
  if (event.type !== "message" || event.message.type !== "text") {
    return;
  }

  console.log("messageEvent:", event);

  const { replyToken } = event;
  const { text } = event.message;
  const lineId = event.source.userId!;
  const profile = await client.getProfile(lineId);
  const displayName = profile.displayName;

  await client.replyMessage(replyToken, {
    type: "text",
    text: `こんにちは${displayName}さん。あなたのLINE IDは${lineId}ですよ。ちなみに${text}と言いましたね。`,
  });
};
