import {TemplateMessage} from "@line/bot-sdk";
const LIFF_URL = "https://liff.line.me/1656766461-gKzBwL6O";

const birthConfirmTemplate = (name: String, birthText: String): TemplateMessage => {
  const birthArray = birthText.split("/");
  const birthday = `${birthArray[0]}年${birthArray[1]}月${birthArray[2]}日`;
  return {
    "type": "template",
    "altText": "お誕生日の確認",
    "template": {
        "type": "buttons",
        "title": "お誕生日登録の確認",
        "text": `${name}さんのお誕生日を\n${birthday}\nで登録します。よろしいですか？`,
        "actions": [
            {
              "type": "postback",
              "label": "はい",
              "data": `birthday&${birthText}`
            },
            {
              "type": "uri",
              "label": "選びなおす",
              "uri": LIFF_URL,
            }
        ]
    }
  }
};

export default birthConfirmTemplate;