import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    name: { type: String, require: true },
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
  { collection: "transactionLabel" }
);

export default schema;
