import * as express from "express";
import * as TransactionLabelQuery from "../../libs/moongoose/query/transaction-label.query";
import { middlewareAccessToken } from "../middleware";
import { TransactionLabelServices } from "./services/index";
import {
  TJwtTokenObject,
  TTransactionLabel,
} from "../../nodejs-proper-money-types/types";
import ZodLib from "../../libs/zod.lib";
import { removeStartAndEndSpaceInString } from "../../libs/utils";

export const TransactionLabelRoutes = {
  register: (app: express.Application) => {
    const router = express.Router();
    router.get(
      "/transaction-label",
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const userId = ZodLib.isMongoId(req.decode?.userId) as string;
          const result = await TransactionLabelQuery.find({
            userId,
            page: req.query.page as unknown as number,
            limit: req.query.limit as unknown as number,
            q: req.query.q as unknown as string,
          });
          return res.json(result);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    router.get(
      "/transaction-label/details",
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const result = await TransactionLabelQuery.findWithIds(
            req.query.ids as unknown as string[]
          );
          return res.json(result);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    router.post(
      "/transaction-label/create",
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
          const transactionLabel = await TransactionLabelQuery.create({
            userId,
            name: removeStartAndEndSpaceInString(req.body.name),
          });
          const result = {
            id: transactionLabel._id,
          };
          return res.json(result);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    router.post(
      "/transaction-label/update",
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
          const doc = (await TransactionLabelQuery.findOneWithId(
            req.body._id
          )) as unknown as TTransactionLabel;
          if (doc && doc.userId == userId) {
            await TransactionLabelQuery.updateOneWithId({
              _id: req.body._id,
              data: {
                name: removeStartAndEndSpaceInString(req.body.name),
                updatedAt: new Date(),
              },
            });
          } else {
            throw Error("transaction label not found, invalid user token");
          }
          const result = {
            id: doc._id,
          };
          return res.status(200).send(result);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    router.post(
      "/transaction-label/delete",
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
          await TransactionLabelServices.deleteTransactionLabelById({
            userId: userId,
            _id: req.body._id,
          });
          return res.status(200).send(true);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    app.use("", router);
  },
};
