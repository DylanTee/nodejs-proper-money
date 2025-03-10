import mongoose from "mongoose";
import { EPointType } from "../../../nodejs-proper-money-types/enum";

const schema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    value: { type: Number, require: true },
    type: {
      type: Number,
      required: true,
      validate: {
        validator: (v: Number) =>
          v === EPointType.add || v === EPointType.deduct,
        message: `is not a valid value`,
      },
    },
    pointFrom: {
      type: {
        type: Number,
        required: true,
      },
      id: {
        type: String || null,
        default: () => {
          return null;
        },
      },
      documentType: {
        type: Number,
      },
    },
    createdAt: { type: Date, default: () => new Date() },
    expiryAt: {
      type: Date,
      default: () => {
        const currentDate = new Date();
        return currentDate.setDate(currentDate.getDate() + 365);
      },
    },
  },
  { collection: "point" }
);

export default schema;
