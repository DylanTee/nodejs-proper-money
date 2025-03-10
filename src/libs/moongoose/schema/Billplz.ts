import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
      default: () => null,
    },
    productId: {
      type: String,
      required: true,
    },
    bill: {
      type: Object,
    },
    payment: {
      type: Object,
    },
    updatedAt: { type: Date, default: () => null },
    createdAt: { type: Date, default: () => new Date() },
  },
  { collection: "billplz" }
);

export default schema;
