import * as VerificationQuery from "../../../libs/moongoose/query/verification.query";
import { TVerification, TUser } from "../../../nodejs-proper-money-types/types";
import { connection } from "../../../libs/moongoose/mongoose.lib";
import * as UserQuery from "../../../libs/moongoose/query/user.query";
import mongoose from "mongoose";
import { UserServices } from "../../user/services";

export default async function verifyShareIdAsOneTimePassword({
  oneTimePassword,
  userId,
}: {
  userId: string;
  oneTimePassword: string;
}) {
  const session = await connection.startSession();
  let sharedUserId = "";

  try {
    await session.withTransaction(async () => {
      const verificationDoc =
        (await VerificationQuery.findOneWithOTPAndNotVerifyShare({
          oneTimePassword: oneTimePassword,
          userId,
        })) as unknown as TVerification;

      let userDoc = (await UserQuery.findOneById(userId)) as unknown as TUser;

      if (userDoc.sharedUserId) {
        throw Error("You've already been shared");
      } else if (verificationDoc) {
        const sharedUserDoc = (await UserQuery.findOneById(
          verificationDoc.userId
        )) as unknown as TUser;

        if (sharedUserDoc.sharedUserId) {
          throw Error("Please ask your partner to remove the other user");
        } else {
          if (verificationDoc.oneTimePassword !== oneTimePassword) {
            throw Error("SHARE ID not found");
          } else {
            await UserServices.updateUser({
              userId: userDoc._id,
              data: {
                sharedUserId: new mongoose.Types.ObjectId(
                  verificationDoc.userId
                ) as unknown as string,
              },
            });

            await UserServices.updateUser({
              userId: verificationDoc.userId,
              data: {
                sharedUserId: new mongoose.Types.ObjectId(
                  userDoc._id
                ) as unknown as string,
              },
            });

            await VerificationQuery.updateOneById({
              _id: verificationDoc._id,
              data: { verifiedAt: new Date(), isVerify: true },
            });
            sharedUserId = verificationDoc.userId;
          }
        }
      } else {
        throw Error("unableToRequest");
      }
    });
  } finally {
    await session.endSession();
  }
  return {
    sharedUserId: sharedUserId,
  };
}
