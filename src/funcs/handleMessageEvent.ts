import { MessageEvent } from "@line/bot-sdk";
import {
  client,
  dynamo
} from "../app";
import invitationFlex from "../messageTemplates/invitationFlex";
import birthdayRegistrationFlex from "../messageTemplates/birthdayRegistrationFlex";
import benefitsImageMap from "../messageTemplates/benefitsImageMap";
import birthConfirmTemplate from "../messageTemplates/birthConfirmTemplate";

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

  // 誕生日を正規表現でチェック
  const regex = /^[0-9]{4}\/([0-9]{1,2})\/([0-9]{1,2})$/;
  if (regex.test(text)) {
    // 値が適正かチェック
    const birthArray = text.split("/");
    if (
      Number(birthArray[0]) > 1950 && Number(birthArray[0]) <= new Date().getFullYear()
      && Number(birthArray[1]) > 0 && Number(birthArray[1]) <= 12
      && Number(birthArray[2]) > 0 && Number(birthArray[2]) <= 31
    ) {
      const birthConfirmMessage = birthConfirmTemplate(displayName, text);
      await client.replyMessage(replyToken, birthConfirmMessage);
    }
  } else {
    switch (text) {
      case "友達にanswerの公式LINEアカウントを紹介する":
        const invitationMessage = invitationFlex(lineId);
        await client.replyMessage(replyToken, invitationMessage);
        break;

      case "answerの公式LINEアカウントの友達紹介人数を確認する":
        const invitings = await getNumberOfInvitings(lineId);
        await client.replyMessage(replyToken, {
          type: "text",
          text: `${displayName}さんの紹介人数は${invitings}人です。`,
        });
        break;

      case "answerの公式LINEアカウントの友達紹介特典を確認する":
        const imageMapMessage = benefitsImageMap();
        await client.replyMessage(replyToken, imageMapMessage);
        break;

      case "誕生日":
        const birthRegistMessage = birthdayRegistrationFlex();
        await client.replyMessage(replyToken, birthRegistMessage);
        break;
    }
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
