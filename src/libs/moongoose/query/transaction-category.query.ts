import mongoose from "mongoose";
import { Model } from "../mongoose.lib";
import { escapeRegex } from "../../utils";
import { ETransactionCategoryType } from "../../../nodejs-proper-money-types/enum";

export async function create({
  userId,
  backgroundColor,
  imagePath,
  type,
  name,
}: {
  userId: string;
  backgroundColor: string;
  imagePath: string;
  type: string;
  name: string;
}) {
  return await Model.TransactionCategory.create({
    userId,
    backgroundColor,
    imagePath,
    type,
    name,
  });
}
export async function find({
  userId,
  q,
  limit,
  page,
  type,
}: {
  userId: string;
  q: string;
  limit: number;
  page: number;
  type: ETransactionCategoryType;
}) {
  const skip = (page - 1) * limit;
  const [totalDocs, docs] = await Promise.all([
    Model.TransactionCategory.find({
      $and: [
        {
          isDeleted: false,
          userId: new mongoose.Types.ObjectId(userId),
          type: type,
        },
        q
          ? {
              name: { $regex: new RegExp(escapeRegex(q), "i") },
            }
          : {},
      ],
    }).countDocuments(),
    Model.TransactionCategory.find({
      $and: [
        {
          isDeleted: false,
          userId: new mongoose.Types.ObjectId(userId),
          type: type,
        },
        q
          ? {
              name: { $regex: new RegExp(escapeRegex(q), "i") },
            }
          : {},
      ],
    })
      .sort({ name: 1, _id: 1 })
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

export async function findTransactionCategoryWithUserId(userId: string) {
  return await Model.TransactionCategory.find({
    userId: new mongoose.Types.ObjectId(userId),
    isDeleted: false,
  });
}

export async function findOneWithId(_id: string) {
  return await Model.TransactionCategory.findOne({
    _id: new mongoose.Types.ObjectId(_id),
    isDeleted: false,
  });
}

export async function updateOneWithId({
  _id,
  data,
}: {
  _id: string;
  data: any;
}) {
  return await Model.TransactionCategory.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(_id) },
    {
      $set: data,
    }
  );
}
