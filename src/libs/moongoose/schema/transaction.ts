import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    transactionCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "TransactionCategory",
    },
    transactionLabelIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "TransactionLabel",
      },
    ],
    currency: { type: String, required: true },
    amount: { type: Number, required: true },
    imagePath: {
      type: String,
      default: () => null,
    },
    note: { type: String, default: () => null },
    isDeleted: { type: Boolean, default: () => false },
    transactedAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => null },
    createdAt: { type: Date, default: () => new Date() },
  },
  { collection: "transaction" }
);

schema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

schema.virtual("transactionCategory", {
  ref: "TransactionCategory",
  localField: "transactionCategoryId",
  foreignField: "_id",
  justOne: true,
  options: {
    select:
      "_id userId name type backgroundColor imagePath isDeleted updatedAt createdAt",
  },
});

schema.virtual("transactionLabels", {
  ref: "TransactionLabel",
  localField: "transactionLabelIds",
  foreignField: "_id",
  justOne: false,
  options: {
    select: "_id userId name isDeleted updatedAt createdAt",
  },
});

schema.set("toObject", { virtuals: true });
schema.set("toJSON", { virtuals: true });

export default schema;
