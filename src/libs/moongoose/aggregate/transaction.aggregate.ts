import mongoose from "mongoose";
import { Model } from "../mongoose.lib";

export const getTotalIncomeAndExpensesByDateRange = async ({
  userId,
  startTransactedAt,
  endTransactedAt,
}: {
  userId: string;
  startTransactedAt: Date;
  endTransactedAt: Date;
}) => {
  const arr = await Model.Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        isDeleted: false,
        transactedAt: {
          $gte: new Date(startTransactedAt),
          $lte: new Date(endTransactedAt),
        },
      },
    },
    {
      $group: {
        _id: {
          currency: "$currency",
          transactionCategoryId: "$transactionCategoryId",
        },
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $lookup: {
        from: "transactionCategory",
        localField: "_id.transactionCategoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $group: {
        _id: { currency: "$_id.currency", type: "$category.type" },
        totalAmount: { $sum: "$totalAmount" },
        categories: {
          $push: {
            _id: "$category._id",
            name: "$category.name",
            type: "$category.type",
            backgroundColor: "$category.backgroundColor",
            imagePath: "$category.imagePath",
            userId: "$category.userId",
            totalAmount: "$totalAmount",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        currency: "$_id.currency",
        type: "$_id.type",
        totalAmount: 1,
        categories: {
          $map: {
            input: {
              $sortArray: {
                input: "$categories",
                sortBy: { totalAmount: -1 }, // ⬅️ Sort categories by totalAmount descending
              },
            },
            as: "category",
            in: {
              _id: "$$category._id",
              name: "$$category.name",
              type: "$$category.type",
              backgroundColor: "$$category.backgroundColor",
              imagePath: "$$category.imagePath",
              userId: "$$category.userId",
              totalAmount: "$$category.totalAmount",
              percentage: {
                $multiply: [
                  { $divide: ["$$category.totalAmount", "$totalAmount"] },
                  100,
                ],
              },
            },
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        income: {
          $push: {
            $cond: [
              { $eq: ["$type", 0] },
              {
                currency: "$currency",
                totalAmount: "$totalAmount",
                categories: "$categories", // Sorted categories inside
              },
              "$$REMOVE",
            ],
          },
        },
        expense: {
          $push: {
            $cond: [
              { $eq: ["$type", 1] },
              {
                currency: "$currency",
                totalAmount: "$totalAmount",
                categories: "$categories", // Sorted categories inside
              },
              "$$REMOVE",
            ],
          },
        },
      },
    },
    { $project: { _id: 0, income: 1, expense: 1 } },
  ]);

  return arr.length > 0 ? arr[0] : undefined;
};

