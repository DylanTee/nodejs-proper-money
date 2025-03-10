import mongoose from "mongoose";
import { ERewardType } from "../../../nodejs-proper-money-types/enum";
import { MomentTimezoneLib } from "../../moment-timezone.lib";
import { Model } from "../mongoose.lib";

export async function create({
  userId,
  value,
  type,
}: {
  userId: string;
  value: string;
  type: ERewardType;
}) {
  return await Model.Reward.create({
    userId,
    value,
    type,
  });
}

export async function find({
  isValid,
  userId,
  page,
  limit,
}: {
  isValid: string;
  userId: string;
  page: number;
  limit: number;
}) {
  const skip = (page - 1) * limit;

  const [totalDocs, docs] = await Promise.all([
    Model.Reward.find({
      $and: [
        {
          userId: userId,
        },
        {
          isRedeemed: isValid == "true" ? true : false,
        },
        {
          expiryAt: {
            $gte: new Date(),
          },
        },
      ],
    }).countDocuments(),
    Model.Reward.find({
      $and: [
        {
          userId: userId,
        },
        {
          isRedeemed: isValid == "true" ? true : false,
        },
        {
          expiryAt: {
            $gte: new Date(),
          },
        },
      ],
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec(),
  ]);

  const totalPages = Math.ceil(totalDocs / limit);
  const hasNextPage = page < totalPages;

  return {
    data: docs,
    pagination: {
      last_visible_page: page,
      has_next_page: hasNextPage,
      total_items: totalDocs,
    },
  };
}

export async function findByThisMonth(type: ERewardType) {
  const month =
    MomentTimezoneLib.getStartAndEndDatetimeByAsiaKualaLumpur("month");
  return await Model.Reward.collection
    .find({
      $and: [
        {
          type: type,
        },
        {
          createdAt: {
            $gte: month.startAt,
            $lte: month.endAt,
          },
        },
      ],
    })
    .toArray();
}

export async function updateOneById({ _id, data }: { _id: string; data: any }) {
  return await Model.Reward.collection.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(_id) },
    {
      $set: data,
    }
  );
}

export async function updateOneRewardToRedeemByIdAndUserId({
  _id,
  userId,
}: {
  userId: string;
  _id: string;
}) {
  return await Model.Reward.findOneAndUpdate(
    {
      $and: [
        {
          _id: new mongoose.Types.ObjectId(_id),
        },
        {
          userId: userId,
        },
        {
          isRedeemed: false,
        },
      ],
    },
    { $set: { isRedeemed: true } }
  );
}
