import * as express from "express";
import { middlewareAccessToken } from "../middleware";
import ZodLib from "../../libs/zod.lib";
import { RewardServices } from "./services";
import { TJwtTokenObject } from "../../nodejs-proper-money-types/types";
import * as RewardQuery from "../../libs/moongoose/query/reward.query";
import * as PointQuery from "../../libs/moongoose/query/point.query";
import { connection } from "../../libs/moongoose/mongoose.lib";
import {
  EMissionType,
  EPointFromType,
} from "../../nodejs-proper-money-types/enum";

export const RewardRoutes = {
  register: (app: express.Application) => {
    const router = express.Router();
    router.get(
      "/reward",
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const userId = ZodLib.isMongoId(req.decode?.userId) as string;
          const rewards = await RewardQuery.find({
            userId: userId,
            isValid: req.query.isValid as string,
            page: req.query.page as unknown as number,
            limit: req.query.limit as unknown as number,
          });
          const result = {
            rewards: rewards.data,
            pagination: rewards.pagination,
          };
          return res.json(result);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    router.get(
      "/reward/store",
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const userId = ZodLib.isMongoId(req.decode?.userId) as string;
          const result = await RewardServices.getRewardStoreItem({ userId });
          return res.json(result);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    router.post(
      "/reward/submit",
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          ZodLib.isString(req.body.phoneNumber) as string;
          ZodLib.isMongoId(req.body?.rewardId) as string;
          const reward = await RewardQuery.updateOneById({
            _id: req.body.rewardId,
            data: {
              phoneNumber: req.body.phoneNumber,
            },
          });
          const result = {
            _id: reward?._id,
          };
          return res.json(result);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    router.post(
      "/reward/claim",
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const userId = ZodLib.isMongoId(req.decode?.userId) as string;
          ZodLib.isMongoId(req.body?.rewardId) as string;
          const session = await connection.startSession();
          await session.withTransaction(
            async () => {
              const doc =
                await RewardQuery.updateOneRewardToRedeemByIdAndUserId({
                  _id: req.body.rewardId,
                  userId: userId,
                });
              if (doc) {
                await PointQuery.create({
                  userId: userId,
                  type: 0,
                  value: doc.value as number,
                  pointFormId: doc._id as unknown as string,
                  pointFromType: EPointFromType.reward_item_store,
                  missionType: doc.type as unknown as EMissionType,
                });
              } else {
                throw Error("Reward not found");
              }
            },
            {
              readPreference: "primary",
              readConcern: { level: "local" },
              writeConcern: { w: "majority" },
            }
          );
          return res.json(true);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    router.post(
      "/reward/redeem",
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const userId = ZodLib.isMongoId(req.decode?.userId) as string;
          ZodLib.isRewardType(req.body?.rewardType);
          const result = await RewardServices.redeemStoreItem({
            userId: userId,
            rewardType: req.body.rewardType,
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
