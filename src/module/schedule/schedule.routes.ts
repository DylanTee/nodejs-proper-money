import * as express from "express";
import { ScheduleServices } from "./services";
import * as UserQuery from "../../libs/moongoose/query/user.query";

export const ScheduleRoutes = {
  register: (app: express.Application) => {
    const router = express.Router();
    router.post(
      "/schedule/getDayReportAndSendNotification",
      async function (req, res) {
        try {
          await ScheduleServices.getDayReportAndSendNotification();
          return res.status(200).send(true);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    router.post("/schedule/updateMemberToEnded", async function (req, res) {
      try {
        await UserQuery.updateManyMemberEndAtByExpired();
        return res.status(200).send(true);
      } catch (e) {
        return res.status(500).json({ error: e.message });
      }
    });
    app.use("", router);
  },
};
