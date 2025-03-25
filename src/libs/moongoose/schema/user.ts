require("dotenv").config();
import mongoose, { Schema } from "mongoose";
const schema = new mongoose.Schema(
  {
    phoneNumber: { type: String, require: true, unique: true },
    displayName: {
      type: String,
      require: true,
    },
    language: {
      type: String,
      default: () => "en",
    },
    currency: {
      type: String,
      default: () => "MYR",
    },
    profileImage: {
      type: String,
      default: () => {
        return `${process.env.S3_BUCKET_BASE_URL}/propermoney/profileImage/logo.png`;
      },
    },
    sharedUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: () => null,
    },
    notificationToken: { type: String || null, default: () => null },
    lastActiveAt: { type: Date, default: () => new Date() },
    createdAt: { type: Date, immutable: true, default: () => new Date() },
  },
  { collection: "user" }
);

schema.virtual("sharedUserInfo", {
  ref: "User",
  localField: "sharedUserId",
  foreignField: "_id",
  justOne: true,
  options: {
    select:
      "profileImage displayName phoneNumber emailAddress notificationToken",
  },
});

schema.set("toObject", { virtuals: true });
schema.set("toJSON", { virtuals: true });

export default schema;
