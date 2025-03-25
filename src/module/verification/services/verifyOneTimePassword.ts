import * as VerificationQuery from "../../../libs/moongoose/query/verification.query";
import { EVerificationOneTimePasswordType } from "../../../nodejs-proper-money-types/enum";
import * as UserQuery from "../../../libs/moongoose/query/user.query";
import {
  TUser,
  TVerification
} from "../../../nodejs-proper-money-types/types";
import { MomentTimezoneLib } from "../../../libs/moment-timezone.lib";
import signJWTtoken from "../../middleware";

export default async function verifyOneTimePassword({
  phoneNumber,
  oneTimePassword,
  oneTimePasswordType,
}: {
  phoneNumber: string;
  oneTimePassword: string;
  oneTimePasswordType: EVerificationOneTimePasswordType;
}) {
  const doc = (await VerificationQuery.findOneWithPhoneNumberAndPasswordType({
    type: oneTimePasswordType,
    phoneNumber: phoneNumber,
  })) as unknown as TVerification;
  if (doc) {
    const isValid =
      oneTimePassword == doc.oneTimePassword || phoneNumber == "+60174449716"; // for store review account
    if (isValid) {
      await VerificationQuery.updateOneById({
        _id: doc._id,
        data: { isVerify: true, verifiedAt: new Date() },
      });
      if (oneTimePasswordType == EVerificationOneTimePasswordType.Login) {
        const user = (await UserQuery.findByPhoneNumber(
          phoneNumber
        )) as unknown as TUser;
        if (user) {
          const tokens = signJWTtoken({ userId: user._id });
          return tokens;
        } else {
          const newUser = await UserQuery.create({
            phoneNumber: phoneNumber
          });
          const tokens = signJWTtoken({
            userId: newUser._id as unknown as string,
          });
          return tokens;
        }
      } else {
        throw Error("unableToRequest");
      }
    } else {
      throw Error("unableToRequest");
    }
  } else {
    throw Error("unableToRequest");
  }
}
