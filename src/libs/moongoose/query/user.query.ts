import mongoose from "mongoose";
import { Model } from "../mongoose.lib";

export async function create({
  phoneNumber
}: {
  phoneNumber: string;
}) {
  return await Model.User.create({
    phoneNumber: phoneNumber,
    displayName: phoneNumber
  });
}

export async function find({
  limit,
  page,
  q,
}: {
  limit: number;
  page: number;
  q: string | undefined;
}) {
  const skip = (page - 1) * limit;
  const [totalDocs, docs] = await Promise.all([
    Model.User.find({
      $and: [
        {
          $or: [
            { lastActiveAt: { $eq: null } },
            {
              lastActiveAt: {
                $lt: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
              },
            },
          ],
        },
        {
          emailAddress: { $ne: null },
        },
      ],
    }).countDocuments(),
    Model.User.find({
      $and: [
        {
          $or: [
            { lastActiveAt: { $eq: null } },
            {
              lastActiveAt: {
                $lt: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
              },
            },
          ],
        },
        {
          emailAddress: { $ne: null },
        },
      ],
    })
      .skip(skip)
      .limit(limit)
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

export async function findOneById(_id: string) {
  return await Model.User.findOne({
    _id: new mongoose.Types.ObjectId(_id),
  })
    .populate("sharedUserInfo")
    .exec();
}

export async function findByPhoneNumber(phoneNumber: string) {
  return await Model.User.findOne({
    phoneNumber: phoneNumber,
  }).populate("sharedUserInfo");
}

export async function findUserNotActive({
  isEmailAddress,
  isPhoneNumber,
}: {
  isEmailAddress: boolean;
  isPhoneNumber: boolean;
}) {
  return await Model.User.collection
    .find({
      $and: [
        {
          $or: [
            { lastActiveAt: { $eq: null } },
            {
              lastActiveAt: {
                $lt: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
              },
            },
          ],
        },
        isEmailAddress
          ? {
              emailAddress: { $ne: null },
            }
          : {},
        isPhoneNumber
          ? {
              phoneNumber: { $ne: null },
            }
          : {},
      ],
    })
    .toArray();
}

export async function findCountActiveUserDaily({
  startLastActiveAt,
  endLastActiveAt,
}: {
  startLastActiveAt: Date;
  endLastActiveAt: Date;
}) {
  return await Model.User.find({
    lastActiveAt: {
      $gte: startLastActiveAt,
      $lte: endLastActiveAt,
    },
  }).countDocuments();
}

export async function findCountNewUserCreatedDaily({
  startCreatedAt,
  endCreatedAt,
}: {
  startCreatedAt: Date;
  endCreatedAt: Date;
}) {
  return await Model.User.find({
    createdAt: {
      $gte: startCreatedAt,
      $lte: endCreatedAt,
    },
  }).countDocuments();
}

export async function updateOneById({ _id, data }: { _id: string; data: any }) {
  return await Model.User.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(_id) },
    {
      $set: data,
    }
  );
}