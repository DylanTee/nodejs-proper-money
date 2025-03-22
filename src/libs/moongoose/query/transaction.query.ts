import mongoose from "mongoose";
import { Model } from "../mongoose.lib";

export async function create({
  transactionCategoryId,
  transactionLabelIds,
  userId,
  currency,
  amount,
  imagePath,
  note,
  transactedAt,
}: {
  userId: string;
  transactionCategoryId: string;
  transactionLabelIds: string[];
  currency: string;
  amount: number;
  imagePath: string | null;
  note: string | null;
  transactedAt: Date;
}) {
  return await Model.Transaction.create({
    userId: new mongoose.Types.ObjectId(userId),
    transactionCategoryId: new mongoose.Types.ObjectId(transactionCategoryId),
    transactionLabelIds,
    currency,
    amount,
    note: note,
    imagePath,
    transactedAt: new Date(transactedAt),
  });
}

export async function findWithDateRange({
  userId,
  startTransactedAt,
  endTransactedAt,
}: {
  userId: string;
  startTransactedAt: Date;
  endTransactedAt: Date;
}) {
  return await Model.Transaction.find({
    $and: [
      { userId: { $eq: new mongoose.Types.ObjectId(userId) } },
      {
        transactedAt: {
          $gte: startTransactedAt,
          $lte: endTransactedAt,
        },
      },
      { isDeleted: { $eq: false } },
    ],
  })
    .sort({ transactedAt: -1 })
    .populate("user")
    .populate("transactionCategory")
    .populate("transactionLabels");
}

export async function findOneWithTransactionCategoryId(categoryId: string) {
  return await Model.Transaction.findOne({
    isDeleted: false,
    transactionCategoryId: new mongoose.Types.ObjectId(categoryId),
  });
}

export async function findOneWithTransactionLabelId(
  transactionLabelId: string
) {
  return await Model.Transaction.findOne({
    transactionLabelIds: {
      $in: [new mongoose.Types.ObjectId(transactionLabelId)],
    },
    isDeleted: false,
  });
}

export async function find({
  page,
  limit,
  userId,
  sharedUserId,
  transactionCategoryId,
  transactionLabelIds,
  startTransactedAt,
  endTransactedAt,
}: {
  page: number;
  limit: number;
  userId: string;
  sharedUserId?: string | null;
  transactionCategoryId?: string;
  transactionLabelIds?: string[];
  startTransactedAt: Date | undefined;
  endTransactedAt: Date | undefined;
}) {
  const skip = (page - 1) * limit;
  const [totalDocs, docs] = await Promise.all([
    Model.Transaction.find({
      $and: [
        { isDeleted: false },
        { userId: new mongoose.Types.ObjectId(userId) },
        transactionCategoryId
          ? {
              transactionCategoryId: new mongoose.Types.ObjectId(
                transactionCategoryId
              ),
            }
          : {},
        transactionLabelIds
          ? {
              transactionLabelIds: {
                $in: transactionLabelIds.map(
                  (labelId) => new mongoose.Types.ObjectId(labelId)
                ),
              },
            }
          : {},
        startTransactedAt && endTransactedAt
          ? {
              transactedAt: {
                $gte: startTransactedAt,
                $lte: endTransactedAt,
              },
            }
          : {},
      ],
      $or: [
        sharedUserId
          ? {
              userId: new mongoose.Types.ObjectId(sharedUserId),
            }
          : {},
      ],
    }).countDocuments(),
    Model.Transaction.find({
      $and: [
        { isDeleted: false },
        { userId: new mongoose.Types.ObjectId(userId) },
        transactionCategoryId
          ? {
              transactionCategoryId: new mongoose.Types.ObjectId(
                transactionCategoryId
              ),
            }
          : {},
        transactionLabelIds
          ? {
              transactionLabelIds: {
                $in: transactionLabelIds.map(
                  (labelId) => new mongoose.Types.ObjectId(labelId)
                ),
              },
            }
          : {},
        startTransactedAt && endTransactedAt
          ? {
              transactedAt: {
                $gte: startTransactedAt,
                $lte: endTransactedAt,
              },
            }
          : {},
      ],
      $or: [
        sharedUserId
          ? {
              userId: new mongoose.Types.ObjectId(sharedUserId),
            }
          : {},
      ],
    })
      .populate("user")
      .populate("transactionCategory")
      .populate("transactionLabels")
      .sort({ transactedAt: -1, _id: 1 })
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

export async function findOneWithId(_id: string) {
  return await Model.Transaction.findOne({
    _id: new mongoose.Types.ObjectId(_id),
  })
    .populate("user")
    .populate("transactionCategory")
    .populate("transactionLabels");
}

export async function updateOneWithIdAndUserId({
  _id,
  userId,
  data,
}: {
  _id: string;
  userId: string;
  data: any;
}) {
  return await Model.Transaction.collection.findOneAndUpdate(
    {
      $and: [
        {
          _id: new mongoose.Types.ObjectId(_id),
          userId: new mongoose.Types.ObjectId(userId),
        },
      ],
    },
    {
      $set: data,
    }
  );
}
