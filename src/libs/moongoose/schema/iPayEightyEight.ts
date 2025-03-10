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
    referenceNo: { type: String, required: true },
    iPayEightyEightResponse: { type: Object, default: () => null },
    iPayEightyEightBackend: { type: Object, default: () => null },
    updatedAt: { type: Date, default: () => null },
    createdAt: { type: Date, default: () => new Date() },
  },
  { collection: "iPayEightyEight" }
);

export default schema;
