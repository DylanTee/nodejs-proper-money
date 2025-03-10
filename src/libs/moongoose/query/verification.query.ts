import mongoose from "mongoose";
import { EVerificationOneTimePasswordType } from "../../../nodejs-proper-money-types/enum";
import { Model } from "../mongoose.lib";

export async function create({
  type,
  oneTimePasswordHarshed,
  phoneNumber,
  userId,
}: {
  type: EVerificationOneTimePasswordType;
  oneTimePasswordHarshed: string;
  phoneNumber: string;
  userId?: string;
}) {
  return await Model.Verification.create({
    type: type,
    oneTimePassword: oneTimePasswordHarshed,
    phoneNumber: phoneNumber,
    expiryAt: new Date(new Date().getTime() + 10 * 60000), //10 minutes
    userId: userId,
  });
}

export async function findOneWithPhoneNumberAndPasswordType({
  type,
  phoneNumber,
}: {
  type: EVerificationOneTimePasswordType;
  phoneNumber: string;
}) {
  return await Model.Verification.findOne({
    $and: [
      {
        phoneNumber: {
          $ne: undefined,
          $eq: phoneNumber,
        },
      },
      { type: { $eq: type } },
      { isVerify: { $eq: false } },
      { expiryAt: { $gte: new Date() } },
    ],
  }).sort({ createdAt: -1 });
}

export async function findOneWithOTPAndNotVerifyShare({
  oneTimePassword,
  userId,
}: {
  oneTimePassword: string;
  userId: string;
}) {
  return await Model.Verification.findOne({
    $and: [
      { userId: { $ne: userId } },
      { oneTimePassword: { $eq: oneTimePassword } },
      { type: { $eq: EVerificationOneTimePasswordType.ShareUser } },
      { isVerify: { $eq: false } },
      { expiryAt: { $gte: new Date() } },
    ],
  }).sort({ $natural: -1 });
}

export async function findOneWithOTPAndTypeAndUserId({
  userId,
  type,
}: {
  userId: string;
  type: EVerificationOneTimePasswordType;
}) {
  return await Model.Verification.findOne({
    $and: [
      { userId: { $eq: userId } },
      { type: { $eq: type } },
      { isVerify: { $eq: false } },
      { expiryAt: { $gte: new Date() } },
    ],
  }).sort({ $natural: -1 });
}

export async function findRequestedWithUserId({
  userId,
  createdAt,
}: {
  userId: string;
  createdAt: Date;
}) {
  return await Model.Verification.collection
    .find({
      $and: [{ userId: { $eq: userId } }, { createdAt: { $gte: createdAt } }],
    })
    .sort({ $natural: -1 })
    .toArray();
}

export async function updateOneById({ _id, data }: { _id: string; data: any }) {
  return await Model.Verification.collection.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(_id) },
    { $set: data }
  );
}
