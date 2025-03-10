import * as VerificationQuery from "../../../libs/moongoose/query/verification.query";
import { ProperServices } from "../../../services/proper-services";
import { EVerificationOneTimePasswordType } from "../../../nodejs-proper-money-types/enum";
import { generateRandomSixNumberString } from "../../../libs/utils";

export default async function requestOTP({
  phoneNumber,
}: {
  phoneNumber: string;
}) {
  const oneTimePassword = await generateRandomSixNumberString();
  await ProperServices.sendCodeForWhatsapps({
    to: phoneNumber,
    code: oneTimePassword,
  });
  const verification = await VerificationQuery.create({
    type: EVerificationOneTimePasswordType.Login,
    oneTimePasswordHarshed: oneTimePassword,
    phoneNumber: phoneNumber,
  });
  if (verification) {
    return {
      verificationOneTimePasswordType: EVerificationOneTimePasswordType.Login,
    };
  } else {
    throw Error("unableToRequest");
  }
}
