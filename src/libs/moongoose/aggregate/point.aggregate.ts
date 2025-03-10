import { Model } from "../mongoose.lib";
import {
  EMissionType,
  EPointFromType,
  EPointType,
} from "../../../nodejs-proper-money-types/enum";
import { MomentTimezoneLib } from "../../moment-timezone.lib";

export const getTotalPointsByUserId = async (userId: string) => {
  try {
    const collection = Model.Point.collection;
    const list = await collection
      .aggregate([
        {
          $match: {
            userId: userId,
          },
        },
        {
          $group: {
            _id: {
              userId: "$userId",
            },
            total: {
              $sum: {
                $cond: [
                  { $eq: ["$type", EPointType.add] },
                  "$value",
                  { $multiply: ["$value", -EPointType.deduct] },
                ],
              },
            },
          },
        },
        {
          $group: {
            _id: "$_id.userId",
            values: {
              $push: {
                type: "$_id.type",
                total: "$total",
              },
            },
          },
        },
      ])
      .toArray();
    if (list.length > 0) {
      return list[0].values[0].total;
    } else {
      return 0;
    }
  } catch (e) {
    throw e;
  }
};

export const getParticipants = async (userIds: string[]) => {
  const week =
    MomentTimezoneLib.getStartAndEndDatetimeByAsiaKualaLumpur("week");
  Model.Point.aggregate([
    {
      $match: {
        "pointFrom.type": EPointFromType.mission,
        "pointFrom.documentType": EMissionType.dailyCheckIn,

        createdAt: {
          $gte: week.startAt,
          $lte: week.endAt,
        },
      },
    },
    {
      $group: {
        _id: "$userId",
        count: { $sum: 1 },
      },
    },
    {
      $match: {
        _id: { $in: userIds },
      },
    },
    {
      $match: {
        count: { $gte: 1 },
      },
    },
    {
      $sort: {
        count: -1,
        userId: 1,
      },
    },
  ]);
};
