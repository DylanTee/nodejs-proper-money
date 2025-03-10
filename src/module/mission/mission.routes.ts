import * as express from "express";
import { middlewareAccessToken } from "../middleware";
import ZodLib from "../../libs/zod.lib";
import { MissionServices } from "./services";
import { TJwtTokenObject } from "../../nodejs-proper-money-types/types";
import { ESubscriptionEntitlement } from "../../nodejs-proper-money-types/enum";

export const MissionRoutes = {
  register: (app: express.Application) => {
    const router = express.Router();
    router.get(
      "/mission",
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const userId = ZodLib.isMongoId(req.decode?.userId) as string;
          const result = await MissionServices.getMissions({
            userId: userId,
            entitlement: req.query
              .entitlement as unknown as ESubscriptionEntitlement,
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
