require("dotenv").config();

import mongoose from "mongoose";
import TransactionSchema from "./schema/transaction";
import VerificationSchema from "./schema/verification";
import RewardSchema from "./schema/reward";
import UserSchema from "./schema/user";
import PointSchema from "./schema/point";
import TransactionCategorySchema from "./schema/transactionCategory";
import TransactionLabelSchema from "./schema/transactionLabel";
import IPayEightyEightSchema from "./schema/iPayEightyEight";
import BillplzSchema from "./schema/Billplz";

export const connection = mongoose.createConnection(
  process.env.MONGO_DB_CONNECTION_STRING as string
);

const User = connection.model("User", UserSchema);
const Point = connection.model("Point", PointSchema);
const Reward = connection.model("Reward", RewardSchema);
const Transaction = connection.model("Transaction", TransactionSchema);
const TransactionCategory = connection.model(
  "TransactionCategory",
  TransactionCategorySchema
);
const TransactionLabel = connection.model(
  "TransactionLabel",
  TransactionLabelSchema
);
const Verification = connection.model("Verification", VerificationSchema);
const IPayEightyEight = connection.model(
  "IPayEightyEight",
  IPayEightyEightSchema
);
const Billplz = connection.model("Billplz", BillplzSchema);

connection.on("error", console.error.bind(console, "connection error:"));
connection.once("open", function () {});

export const Model = {
  User,
  Verification,
  Point,
  TransactionCategory,
  Transaction,
  TransactionLabel,
  Reward,
  IPayEightyEight,
  Billplz
};
