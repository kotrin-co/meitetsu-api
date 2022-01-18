import {FlexMessage} from "@line/bot-sdk";
const BIRTHDAY_REGISTRATION_IMAGE = "https://answer.salon/line_images/birthday-registration.png";
const LIFF_URL = "https://liff.line.me/1656766461-gKzBwL6O";

const birthdayRegistrationFlex = (): FlexMessage => {
  return {
    type: "flex",
    altText: "お誕生日登録",
    contents:
      {
        "type": "bubble",
        "size": "mega",
        "hero": {
          "type": "image",
          "url": BIRTHDAY_REGISTRATION_IMAGE,
          "action": {
            "type": "uri",
            "label": "action",
            "uri": LIFF_URL,
          },
          "size": "full"
        }
      }
  };
};

export default birthdayRegistrationFlex;
