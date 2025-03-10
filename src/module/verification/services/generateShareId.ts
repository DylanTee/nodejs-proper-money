import * as UserQuery from "../../../libs/moongoose/query/user.query";
import * as VerificationQuery from "../../../libs/moongoose/query/verification.query";
import { EVerificationOneTimePasswordType } from "../../../nodejs-proper-money-types/enum";
import { TUser, TVerification } from "../../../nodejs-proper-money-types/types";
import { generateRandomSixNumberString } from "../../../libs/utils";

export default async function generateShareId({ userId }: { userId: string }) {
  const userDoc = (await UserQuery.findOneById(userId)) as unknown as TUser;
  if (userDoc) {
    if (userDoc.sharedUserId) {
      throw Error("sharedUserId found");
    } else {
      const doc = (await VerificationQuery.findOneWithOTPAndTypeAndUserId({
        userId,
        type: EVerificationOneTimePasswordType.ShareUser,
      })) as unknown as TVerification;
      if (doc) {
        return {
          oneTimePassword: doc.oneTimePassword,
          expiryAt: doc.expiryAt,
        };
      } else {
        const oneTimePassword = await generateRandomSixNumberString();
        const upperCaseOneTimePassword = oneTimePassword.toUpperCase();
        const insertedDocId = await VerificationQuery.create({
          userId,
          oneTimePasswordHarshed: upperCaseOneTimePassword, // no need harsh, need to reuse it if user back to previous screen
          type: EVerificationOneTimePasswordType.ShareUser,
          phoneNumber: "",
        });
        if (insertedDocId) {
          const doc = (await VerificationQuery.findOneWithOTPAndTypeAndUserId({
            type: EVerificationOneTimePasswordType.ShareUser,
            userId,
          })) as unknown as TVerification;
          if (doc) {
            return {
              oneTimePassword: doc.oneTimePassword,
              expiryAt: doc.expiryAt,
            };
          } else {
            throw Error("verification not found");
          }
        } else {
          throw Error("inserted verification id not found");
        }
      }
    }
  } else {
    throw Error("user not found");
  }
}
