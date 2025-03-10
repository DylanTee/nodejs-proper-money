import * as express from "express";
import { middlewareAccessToken } from "../middleware";
import {
  TJwtTokenObject,
  TPostPointClaimBody,
} from "../../nodejs-proper-money-types/types";
import ZodLib from "../../libs/zod.lib";
import { PointServices } from "./services";
import { EMissionType } from "../../nodejs-proper-money-types/enum";
import * as PointAggregate from "../../libs/moongoose/aggregate/point.aggregate";

export const PointRoutes = {
  register: (app: express.Application) => {
    const router = express.Router();
    router.get(
      "/point/total",
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const userId = ZodLib.isMongoId(req.decode?.userId) as string;
          const totalPoints = await PointAggregate.getTotalPointsByUserId(
            userId
          );
          const result = {
            totalPoints: totalPoints,
          };
          return res.json(result);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    router.post(
      "/point/claim",
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const userId = ZodLib.isMongoId(req.decode?.userId) as string;
          const missionType = ZodLib.isMissionType(
            req.body.missionType
          ) as EMissionType;
          await PointServices.claimPoint({
            missionType: missionType,
            entitlement: req.body.entitlement,
            userId: userId,
          });
          return res.json(true);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    app.use("", router);
  },
};
