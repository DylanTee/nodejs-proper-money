import mongoose from "mongoose";
import { z } from "zod";
import {
  EMissionType,
  ERewardType,
  ETransactionCategoryType,
} from "../nodejs-proper-money-types/enum";

const email = (input: string | undefined) => {
  try {
    const validator = z
      .string()
      .email({ message: "Incorrect email format (eg:example@gmail.com)" });
    const result = validator.parse(input);
    return result;
  } catch (e) {
    if (e instanceof z.ZodError) {
      throw Error(e.issues[0].message);
    }
  }
};

const password = (input: string) => {
  try {
    const validator = z
      .string()
      .min(6, { message: "Min 6 digits in password" });
    const result = validator.parse(input);
    return result;
  } catch (e) {
    if (e instanceof z.ZodError) {
      throw Error(e.issues[0].message);
    }
  }
};

const isString = (input: string) => {
  try {
    const validator = z.string().min(1);
    const result = validator.parse(input);
    return result;
  } catch (e) {
    if (e instanceof z.ZodError) {
      throw Error(e.issues[0].message);
    }
  }
};

const isNumber = (input: number) => {
  try {
    const validator = z.number().min(0.01);
    const result = validator.parse(input);
    return result;
  } catch (e) {
    if (e instanceof z.ZodError) {
      throw Error(e.issues[0].message);
    }
  }
};

const isDate = (input: string) => {
  try {
    const validator = z
      .string()
      .transform((val) => new Date(val))
      .refine((date) => !isNaN(date.getTime()), {
        message: "Invalid date format",
      });
    const result = validator.safeParse(input);
    return result.success;
  } catch (e) {
    if (e instanceof z.ZodError) {
      throw Error(e.issues[0].message);
    }
  }
};

const isMongoId = (input: string | undefined) => {
  const isValid = () => mongoose.isValidObjectId(input);
  try {
    const validator = z.string().refine(isValid, (val) => ({
      message: ``,
    }));
    const result = validator.parse(input);
    return result;
  } catch (e) {
    if (e instanceof z.ZodError) {
      throw Error(e.issues[0].message);
    }
  }
};

const isOneTimePassword = (input: string) => {
  try {
    const validator = z.string().length(6);
    const result = validator.parse(input);
    return result;
  } catch (e) {
    if (e instanceof z.ZodError) {
      throw Error(e.issues[0].message);
    }
  }
};

const isTransactionCategoryType = (input: number) => {
  const isValid = () =>
    input == ETransactionCategoryType.income ||
    input == ETransactionCategoryType.expense;
  try {
    const validator = z.number().refine(isValid, (val) => ({
      message: ``,
    }));
    const result = validator.parse(input);
    return result;
  } catch (e) {
    if (e instanceof z.ZodError) {
      throw Error(e.issues[0].message);
    }
  }
};


const isMissionType = (input: number) => {
  const isValid = () =>
    input == EMissionType.dailyCheckIn ||
    input == EMissionType.daiyAddIncomeOrExpense ||
    input == EMissionType.weeklyAddIncomeOrExpense ||
    input == EMissionType.weeklyCheckIn;
  try {
    const validator = z.number().refine(isValid, (val) => ({
      message: ``,
    }));
    const result = validator.parse(input);
    return result;
  } catch (e) {
    if (e instanceof z.ZodError) {
      throw Error(e.issues[0].message);
    }
  }
};

const isRewardType = (input: number) => {
  const isValid = () =>
    input == ERewardType.reward_store_item_touch_and_go_ewallet ||
    ERewardType.reward_store_item_touch_and_go_ewallet_check_in_weekly_ticket;
  try {
    const validator = z.number().refine(isValid, (val) => ({
      message: `Invalid Reward type`,
    }));
    const result = validator.parse(input);
    return result;
  } catch (e) {
    if (e instanceof z.ZodError) {
      throw Error(e.issues[0].message);
    }
  }
};

const ZodLib = {
  email,
  password,
  isNumber,
  isMongoId,
  isOneTimePassword,
  isTransactionCategoryType,
  isMissionType,
  isString,
  isRewardType,
  isDate
};

export default ZodLib;
