import {Request, Response} from "express";
import {dynamo} from "../app";

const TABLE_NAME = process.env.TABLE_NAME!;

const handleInvitation = async (
  req: Request,
  res: Response,
  myLineId: string,
  name: string,
  invitedBy: string
) => {
  const duplicate = await checkDuplicate(myLineId, invitedBy);
  console.log("duplicate => ", duplicate);
  if (!duplicate && (myLineId !== invitedBy)) {
    await updateInvited(myLineId, invitedBy);
    await updateInviter(myLineId, invitedBy);
    res.status(200).send("Invitation Success!");
  } else {
    res.status(201).send("Invitation failed!");
  }
}

const checkDuplicate = (
  invitedId: string,
  inviterId: string
): Promise<Boolean> => {
  return new Promise((resolve, reject) => {
    const selectParams = {
      TableName: TABLE_NAME,
      Key: {
        "lineId": inviterId,
      }
    };

    dynamo.get(selectParams, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        if (data.Item !== undefined) {
          const inviteList = data.Item.invite;
          console.log("inviteList", inviteList);
          const check = inviteList.includes(invitedId) ? true : false;
          resolve(check);
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