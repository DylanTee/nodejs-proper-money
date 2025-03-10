import * as express from "express";
import { middlewareAccessToken } from "../middleware";
import { VerificationsServices } from "./services/index";
import ZodLib from "../../libs/zod.lib";
import { TJwtTokenObject } from "../../nodejs-proper-money-types/types";

export const VerificationsRoutes = {
  register: (app: express.Application) => {
    const router = express.Router();
    router.post("/verification/verify", async function (req, res) {
      try {
        ZodLib.isString(req.body.oneTimePassword);
        const result = await VerificationsServices.verifyOneTimePassword({
          phoneNumber: req.body.phoneNumber,
          oneTimePassword: req.body.oneTimePassword,
          oneTimePasswordType: req.body.oneTimePasswordType,
        });
        return res.json(result);
      } catch (e) {
        return res.status(500).json({ error: e.message });
      }
    });
    router.get(
      "/verification/generate-share-id",
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const userId = ZodLib.isMongoId(req.decode?.userId) as string;
          const result = await VerificationsServices.generateShareId({
            userId,
          });
          return res.json(result);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    router.post(
      "/verification/verify-share-id",
      middlewareAccessToken,
      async function (
        req: express.Request & {
          decode?: TJwtTokenObject;
        },
        res
      ) {
        try {
          const userId = ZodLib.isMongoId(req.decode?.userId) as string;
          ZodLib.isString(req.body.oneTimePassword);
          const result =
            await VerificationsServices.verifyShareIdAsOneTimePassword({
              userId,
              oneTimePassword: req.body.oneTimePassword,
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
