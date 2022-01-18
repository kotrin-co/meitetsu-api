import {ImageMapMessage} from "@line/bot-sdk";
const BENEFITS_BASE_URL = "https://answer.salon/line_images/benefits/";

const benefitsImageMap = (): ImageMapMessage => {
  return {
    "type": "imagemap",
    "baseUrl": BENEFITS_BASE_URL,
    "altText": "お友だち紹介特典",
    "baseSize": {
      "width": 1040,
      "height": 1392
    },
    "actions": [],
  };
};

export default benefitsImageMap;
