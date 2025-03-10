import * as express from "express";
import * as UserQuery from "../../libs/moongoose/query/user.query";
import * as TransactionQuery from "../../libs/moongoose/query/transaction.query";
import { middlewareAccessToken } from "../middleware";
import { TransactionServices } from "./services/index";
import {
  TJwtTokenObject,
  TUser,
  TTransactionCategory,
} from "../../nodejs-proper-money-types/types";
import ZodLib from "../../libs/zod.lib";
import mongoose from "mongoose";
import { removeStartAndEndSpaceInString } from "../../libs/utils";
import { ProperServices } from "../../services/proper-services";
import { decode } from "punycode";

export const TransactionRoutes = {
  register: (app: express.Application) => {
    const router = express.Router();
    router.get(
      "/transaction",
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const userId = ZodLib.isMongoId(
            req.decode?.userId
          ) as unknown as string;
          const user = await UserQuery.findOneById(userId);
          const transactions = await TransactionQuery.find({
            page: req.query.page as unknown as number,
            limit: req.query.limit as unknown as number,
            userId,
            sharedUserId: user?.sharedUserId as unknown as string,
            transactionCategoryId: req.query
              .transactionCategoryId as unknown as string,
            transactionLabelId: req.query
              .transactionLabelId as unknown as string,
          });
          const result = transactions;
          return res.json(result);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    router.get(
      `/transaction/dashboard`,
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const userId = ZodLib.isMongoId(req.decode?.userId) as string;
          const startTransactedAt = ZodLib.isString(
            req.query.startTransactedAt as string
          ) as string;
          const endTransactedAt = ZodLib.isString(
            req.query.endTransactedAt as string
          ) as string;
          const result = await TransactionServices.getDashboard({
            userId: userId,
            startTransactedAt: startTransactedAt,
            endTransactedAt: endTransactedAt,
          });
          return res.json(result);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    router.post(
      "/transaction/create",
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const userId = ZodLib.isMongoId(req.decode?.userId) as string;
          ZodLib.isMongoId(req.body.transactionCategoryId);
          ZodLib.isNumber(req.body.amount);
          ZodLib.isDate(req.body.transactedAt);
          const transactionLabelIdsObjectId = req.body.transactionLabelIds?.map(
            (_id: string) => new mongoose.Types.ObjectId(_id)
          );
          const transaction = await TransactionQuery.create({
            userId: new mongoose.Types.ObjectId(userId) as unknown as string,
            transactionCategoryId: new mongoose.Types.ObjectId(
              req.body.transactionCategoryId
            ) as unknown as string,
            transactionLabelIds: transactionLabelIdsObjectId,
            currency: req.body.currency,
            amount: req.body.amount,
            note: req.body.note
              ? removeStartAndEndSpaceInString(req.body.note)
              : null,
            imagePath: req.body.imagePath,
            transactedAt: new Date(req.body.transactedAt),
          });
          const user = (await UserQuery.findOneById(
            userId
          )) as unknown as TUser;
          const category =
            (await TransactionQuery.findOneWithTransactionCategoryId(
              req.body.transactionCategoryId
            )) as unknown as TTransactionCategory;
          if (user.sharedUserInfo && user.sharedUserInfo.notificationToken) {
            ProperServices.sendNotification({
              token: user.sharedUserInfo.notificationToken,
              title: "New transaction",
              body: `${
                req.body.amount
              } ${req.body.currency.toUpperCase()} was added at ${
                category.name
              } by ${user.displayName}`,
            });
          }
          const result = {
            id: transaction.id,
          };
          return res.status(200).send(result);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    router.post(
      "/transaction/update",
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const userId = ZodLib.isMongoId(req.decode?.userId) as string;
          ZodLib.isMongoId(req.body._id);
          ZodLib.isNumber(req.body.amount);
          ZodLib.isDate(req.body.transactedAt);

          const transactionLabelIdsObjectId = req.body.transactionLabelIds.map(
            (_id: string) => new mongoose.Types.ObjectId(_id)
          );
          const transaction = await TransactionQuery.updateOneWithIdAndUserId({
            userId: userId,
            _id: req.body._id,
            data: {
              transactionCategoryId: new mongoose.Types.ObjectId(
                req.body.transactionCategoryId
              ),
              transactionLabelIds: transactionLabelIdsObjectId,
              currency: req.body.currency,
              amount: req.body.amount,
              imagePath: req.body.imagePath,
              note: req.body.note
                ? removeStartAndEndSpaceInString(req.body.note)
                : null,
              transactedAt: new Date(req.body.transactedAt),
              updatedAt: new Date(),
            },
          });
          const result = {
            id: transaction?._id,
          };
          return res.json(result);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    router.post(
      "/transaction/delete",
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const userId = ZodLib.isMongoId(req.decode?.userId) as string;
          ZodLib.isMongoId(req.body._id);
          const transaction = await TransactionQuery.updateOneWithIdAndUserId({
            _id: req.body._id,
            userId,
            data: {
              isDeleted: true,
              updatedAt: new Date(),
            },
          });
          const result = {
            id: transaction?._id,
          };
          return res.json(result);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    app.use("", router);
  },
};
