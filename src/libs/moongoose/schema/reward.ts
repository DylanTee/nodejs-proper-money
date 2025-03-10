import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    value: { type: Number, require: true },
    type: {
      type: String,
      required: true,
    },
    isRedeemed: { type: Boolean, default: () => false },
    phoneNumber: { type: String, default: () => null },
    emailAddress: { type: String, default: () => null },
    evidenceImagePath: { type: String, default: () => null },
    expiryAt: {
      type: Date,
      default: () => {
        const currentDate = new Date();
        return currentDate.setDate(currentDate.getDate() + 7);
      },
    },
    createdAt: { type: Date, default: () => new Date() },
  },
  { collection: "reward" }
);

export default schema;
