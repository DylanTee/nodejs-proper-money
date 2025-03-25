import * as express from "express";
import { ScheduleServices } from "./services";

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
    )
    app.use("", router);
  },
};
