import mongoose from "mongoose";
import { Model } from "../mongoose.lib";
import { escapeRegex } from "../../utils";

export async function create({
  name,
  userId,
}: {
  name: string;
  userId: string;
}) {
  return await Model.TransactionLabel.create({
    name,
    userId,
  });
}

export async function find({
  q,
  page,
  limit,
  userId,
}: {
  q: string;
  userId: string;
  page: number;
  limit: number;
}) {
  const skip = (page - 1) * limit;
  const [totalDocs, docs] = await Promise.all([
    Model.TransactionLabel.find({
      $and: [
        {
          isDeleted: false,
          userId: new mongoose.Types.ObjectId(userId),
          name: { $regex: new RegExp(escapeRegex(q), "i") },
        },
      ],
    }).countDocuments(),
    Model.TransactionLabel.find({
      $and: [
        {
          isDeleted: false,
          userId: new mongoose.Types.ObjectId(userId),
          name: { $regex: new RegExp(escapeRegex(q), "i") },
        },
      ],
    })
      .sort({ createdAt: -1 })
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

export async function findWithIds(_ids: string[]) {
  return await Model.TransactionLabel.find({
    _id: {
      $in: _ids.map((id) => new mongoose.Types.ObjectId(id)),
    },
    isDeleted: false,
  });
}

export async function findWithUserId(userId: string) {
  return await Model.TransactionLabel.find({
    userId: new mongoose.Types.ObjectId(userId),
    isDeleted: false,
  });
}

export async function findOneWithId(_id: string) {
  return await Model.TransactionLabel.findOne({
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
  return await Model.TransactionLabel.collection.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(_id) },
    {
      $set: data,
    }
  );
}
