import * as express from "express";
import { middlewareAccessToken } from "../middleware";
import { TransactionCategoryServices } from "./services/index";
import { TJwtTokenObject } from "../../nodejs-proper-money-types/types";
import ZodLib from "../../libs/zod.lib";
import * as TransactionCategoryQuery from "../../libs/moongoose/query/transaction-category.query";
import { removeStartAndEndSpaceInString } from "../../libs/utils";
import { ETransactionCategoryType } from "../../nodejs-proper-money-types/enum";

export const TransactionCategoryRoutes = {
  register: (app: express.Application) => {
    const router = express.Router();
    router.get(
      "/transaction-category",
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const userId = ZodLib.isMongoId(
            req.query.userId as unknown as string
          ) as string;
          const transactionCategories = await TransactionCategoryQuery.find({
            userId,
            page: req.query.page as unknown as number,
            limit: req.query.limit as unknown as number,
            q: req.query.q as unknown as string,
            type: req.query.type as unknown as ETransactionCategoryType,
          });
          const result = transactionCategories;
          return res.json(result);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    router.get(
      "/transaction-category/detail",
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const result = await TransactionCategoryQuery.findOneWithId(
            req.query.id as unknown as string
          );
          return res.json(result);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    router.get(
      "/transaction-category/assets",
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const result =
            await TransactionCategoryServices.getTransactionCategoryAssets();
          return res.json(result);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    router.post(
      "/transaction-category/create",
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const userId = ZodLib.isMongoId(req.decode?.userId) as string;
          ZodLib.isString(req.body.name);
          ZodLib.isString(req.body.backgroundColor);
          ZodLib.isString(req.body.imagePath);
          ZodLib.isTransactionCategoryType(req.body.type);
          const transactionCategory = await TransactionCategoryQuery.create({
            userId: userId,
            backgroundColor: req.body.backgroundColor,
            imagePath: req.body.imagePath,
            type: req.body.type,
            name: removeStartAndEndSpaceInString(req.body.name),
          });
          const result = {
            id: transactionCategory._id,
          };
          return res.json(result);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    router.post(
      "/transaction-category/update",
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const userId = ZodLib.isMongoId(req.decode?.userId) as string;
          ZodLib.isMongoId(req.body._id) as string;
          ZodLib.isString(req.body.name);
          ZodLib.isString(req.body.backgroundColor);
          ZodLib.isString(req.body.imagePath);
          ZodLib.isTransactionCategoryType(req.body.type);
          const body = {
            userId,
            _id: req.body._id,
            name: req.body.name,
            backgroundColor: req.body.backgroundColor,
            imagePath: req.body.imagePath,
            type: req.body.type,
          };
          await TransactionCategoryServices.editTransactionCategory(body);
          return res.status(200).send(true);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    router.post(
      "/transaction-category/delete",
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
          const result =
            await TransactionCategoryServices.deleteTransactionCategoryById({
              userId: userId,
              _id: req.body._id,
            });
          return res.json(result);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    app.use("", router);
  },
};
