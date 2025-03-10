import mongoose, { Schema } from "mongoose";
import { ETransactionCategoryType } from "../../../nodejs-proper-money-types/enum";

const schema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    type: {
      type: Number,
      validate: {
        validator: (v: Number) =>
          v === ETransactionCategoryType.income ||
          v === ETransactionCategoryType.expense,
        message: ``,
      },
    },
    backgroundColor: {
      type: String,
      require: true,
    },
    imagePath: {
      type: String,
      require: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
      default: () => null,
    },
    isDeleted: { type: Boolean, default: () => false },
    updatedAt: { type: Date, default: () => null },
    createdAt: { type: Date, immutable: true, default: () => new Date() },
  },
  { collection: "transactionCategory" }
);

export default schema;
