import {
  MessageEvent,
  TextMessage,
} from "@line/bot-sdk";
import {
  client,
  dynamo
} from "../app";
import invitationFlex from "../flexMessages/invitationFlex";
import benefitsImageMap from "../flexMessages/benefitsImageMap";

const TABLE_NAME = process.env.TABLE_NAME!;

export const handleTextEvent = async (event: MessageEvent) => {
  if (event.type !== "message" || event.message.type !=="text") {
    return;
  }
  const {replyToken} = event;
  const {text} = event.message;
  const lineId = event.source.userId!;
  const profile = await client.getProfile(lineId);
  const displayName = profile.displayName;

  switch (text) {
    case "紹介":
      const flexMessage = invitationFlex(lineId);
      await client.replyMessage(replyToken, flexMessage);
      break;

    case "紹介人数":
      const invitings = await getNumberOfInvitings(lineId);
      await client.replyMessage(replyToken, {
        type: "text",
        text: `${displayName}さんの紹介人数は${invitings}人です。`,
      });
      break;

    case "紹介特典":
      const imageMapMessage = benefitsImageMap();
      await client.replyMessage(replyToken, imageMapMessage);

    default:
      await client.replyMessage(replyToken, {
        type: "text",
        text,
      });
  }
};

const getNumberOfInvitings = (lineId: string) => {
  return new Promise((resolve, reject) => {
    const selectParams = {
      TableName: TABLE_NAME,
      Key: {
        "lineId": lineId
      }
    };

    dynamo.get(selectParams, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        if (data.Item !== undefined) {
          const invitings = data.Item.invite.length;
          resolve(invitings);
        }
      }
    });
  });
};
