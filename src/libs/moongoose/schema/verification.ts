import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    userId: { type: String },
    type: { type: String, required: true },
    oneTimePassword: { type: String },
    phoneNumber: { type: String, require: true, default: () => null },
    isVerify: { type: Boolean, default: () => false },
    expiryAt: { type: Date, require: true },
    verifiedAt: { type: Date, default: () => null },
    createdAt: { type: Date, require: true, default: () => new Date() },
  },
  { collection: "verification" }
);

export default schema;
