import {
  EMissionType,
  EPointFromType,
  EPointType,
  ERewardType,
} from "../../../nodejs-proper-money-types/enum";
import { Model } from "../mongoose.lib";

export async function create({
  userId,
  type,
  value,
  pointFromType,
  pointFormId,
  missionType,
}: {
  userId: string;
  type: EPointType;
  value: number;
  pointFromType: EPointFromType;
  pointFormId: string | null;
  missionType: EMissionType|ERewardType;
}) {
  return await Model.Point.create({
    userId,
    type,
    value: value,
    pointFrom: {
      type: pointFromType,
      id: pointFormId,
      documentType: missionType,
    },
  });
}

export async function findCountUserHasMissionDailyCheckIn({
  startCreatedAt,
  endCreatedAt,
}: {
  startCreatedAt: Date;
  endCreatedAt: Date;
}) {
  return await Model.Point.find({
    $and: [
      {
        "pointFrom.type": { $eq: EPointFromType.mission },
      },
      {
        "pointFrom.documentType": { $eq: EMissionType.dailyCheckIn },
      },
      {
        createdAt: {
          $gte: startCreatedAt,
          $lte: endCreatedAt,
        },
      },
    ],
  }).countDocuments();
}

export async function findMissionClaimablebyUserId({
  userId,
  missionType,
  startCreatedAt,
  endCreatedAt,
}: {
  userId: string;
  missionType: EMissionType;
  startCreatedAt: Date;
  endCreatedAt: Date;
}) {
  return await Model.Point.collection
    .find({
      $and: [
        {
          userId: { $eq: userId },
        },
        {
          "pointFrom.type": { $eq: EPointFromType.mission },
        },
        {
          "pointFrom.documentType": { $eq: missionType },
        },
        {
          createdAt: {
            $gte: startCreatedAt,
            $lte: endCreatedAt,
          },
        },
      ],
    })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function findRewardStoreItemClaimableByUserId({
  userId,
  rewardType,
  startCreatedAt,
  endCreatedAt,
}: {
  userId: string;
  rewardType: ERewardType;
  startCreatedAt: Date;
  endCreatedAt: Date;
}) {
  return await Model.Point.collection
    .find({
      $and: [
        {
          userId: { $eq: userId },
        },
        {
          "pointFrom.type": { $eq: EPointFromType.reward_item_store },
        },
        {
          "pointFrom.documentType": { $eq: rewardType },
        },
        {
          createdAt: {
            $gte: startCreatedAt,
            $lte: endCreatedAt,
          },
        },
      ],
    })
    .sort({ createdAt: -1 })
    .toArray();
}
