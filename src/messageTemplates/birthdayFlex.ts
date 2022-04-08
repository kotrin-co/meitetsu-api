import { FlexMessage } from "@line/bot-sdk";

const BIRTHDAY_IMAGE = "https://answer.salon/line_images/answer_LINE_birthday.png";

const birthdayFlex = (): FlexMessage => {
  return {
    type: "flex",
    altText: "お誕生日おめでとうございます",
    contents:
      {
        "type": "bubble",
        "size": "mega",
        "hero": {
          "type": "image",
          "url": BIRTHDAY_IMAGE,
          "size": "full"
        }
      }
  };
};

export default birthdayFlex;
