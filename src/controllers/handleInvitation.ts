import {Request, Response} from "express";
import {dynamo} from "../app";
import axios from "axios";
import qs from "qs";
const LIFF_ID_INVITATION = process.env.LIFF_ID_INVITATION!;

const TABLE_NAME = process.env.TABLE_NAME!;

const handleInvitation = async (
  req: Request,
  res: Response,
  invitedBy: string,
  idToken: string
) => {
  // idTokenからユーザー情報を取得する
  const loginChannelId = LIFF_ID_INVITATION.split("-")[0];
  console.log("invite params => ", invitedBy, idToken, loginChannelId);
  const postData = {
    id_token: idToken,
    client_id: loginChannelId,
  };
  try {
    const response = await axios.post("https://api.line.me/oauth2/v2.1/verify", qs.stringify(postData));
    const myLineId = response.data.sub;
    console.log("res => ", response.data);
    const duplicate = await checkDuplicate(myLineId, invitedBy);
    console.log("duplicate => ", duplicate);
    if (!duplicate && (myLineId !== invitedBy)) {
      await updateInvited(myLineId, invitedBy);
      await updateInviter(myLineId, invitedBy);
      res.status(200).send("Invitation Success!");
    } else {
      res.status(201).send("Invitation failed!");
    }
  } catch (error) {

  }
}

const checkDuplicate = (
  invitedId: string,
  inviterId: string
): Promise<Boolean> => {
  return new Promise((resolve, reject) => {
    const selectParams_1 = {
      TableName: TABLE_NAME,
      Key: {
        "lineId": inviterId,
      }
    };

    const selectParams_2 = {
      TableName: TABLE_NAME,
      Key: {
        "lineId": invitedId,
      }
    };

    dynamo.get(selectParams_1, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        if (data.Item !== undefined) {
          const inviteList = data.Item.invite;
          console.log("inviteList", inviteList);
          let check = inviteList.includes(invitedId) ? true : false;
          dynamo.get(selectParams_2, (err, data) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              if (data.Item !== undefined) {
                const invitedBy = data.Item.invitedBy;
                if (invitedBy === inviterId) check = true;
                resolve(check);
              } else {
                reject("データなし");
              }
            }
          });
        } else {
          reject("データなし");
        }
      }
    });
  });
};

const updateInvited = (
  invitedId: string,
  inviterId: string
) => {
  return new Promise((resolve, reject) => {
    const updateParams = {
      TableName: TABLE_NAME,
      Key: {
        "lineId": invitedId
      },
      UpdateExpression: "set invitedBy = :val",
      ExpressionAttributeValues: {
        ":val": inviterId
      },
      ReturnedValue: "UPDATED",
    };

    dynamo.update(updateParams, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log("invited update success!");
        resolve(data);
      }
    })
  })
};

const updateInviter = (
  invitedId: string,
  inviterId: string
) => {
  return new Promise((resolve, reject) => {
    const updateParams = {
      TableName: TABLE_NAME,
      Key: {
        "lineId": inviterId
      },
      UpdateExpression: "set invite[9999] = :val",
      ExpressionAttributeValues: {
        ":val": invitedId
      },
      ReturnedValue: "UPDATED",
    };

    dynamo.update(updateParams, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log("inviter update success!");
        resolve(data);
      }
    });
  });
};

export default handleInvitation;