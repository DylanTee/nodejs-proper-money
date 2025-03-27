import * as express from "express";
import * as UserQuery from "../../libs/moongoose/query/user.query";
import signJWTtoken, {
  middlewareAccessToken,
  middlewareRefreshToken,
} from "../middleware";
import { UserServices } from "./services/index";
import ZodLib from "../../libs/zod.lib";
import { TJwtTokenObject } from "../../nodejs-proper-money-types/types";

export const UserRoutes = {
  register: (app: express.Application) => {
    const router = express.Router();
    router.post(
      "/user/refresh-access-token",
      middlewareRefreshToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const userId = ZodLib.isMongoId(req.decode?.userId) as string;
          const user = await UserQuery.findOneById(userId);
          if (user) {
            let data: TJwtTokenObject = {
              userId: user._id.toString(),
            };
            const result = await signJWTtoken(data);
            return res.json(result);
          } else {
            throw Error("User not found");
          }
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    router.post("/user/request-otp", async function (req, res) {
      ZodLib.isString(req.body.phoneNumber) as string;
      try {
        const result = await UserServices.requestOTP({
          phoneNumber: req.body.phoneNumber,
        });
        return res.json(result);
      } catch (e) {
        return res.status(500).json({ error: e.message });
      }
    });
    router.post(
      "/user/update",
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const userId = ZodLib.isMongoId(req.decode?.userId) as string;
          const result = await UserServices.updateUser({
            data: req.body,
            userId: userId,
          });
          return res.json(result);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    router.get(
      "/user/detail",
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const userId = ZodLib.isMongoId(req.decode?.userId) as string;
          const result = await UserServices.detail(userId);
          return res.json(result);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    router.post(
      "/user/remove-shared-user",
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const userId = ZodLib.isMongoId(req.decode?.userId) as string;
          const sharedUserId = ZodLib.isMongoId(
            req.body.sharedUserId
          ) as string;
          await UserServices.removeSharedUser({
            sharedUserId: sharedUserId,
            userId,
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
