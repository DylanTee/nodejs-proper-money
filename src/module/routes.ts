import * as express from "express";
import { UserRoutes } from "./user/user.routes";
import { VerificationsRoutes } from "./verification/verification.routes";
import { TransactionRoutes } from "./transaction/transaction.routes";
import { TransactionCategoryRoutes } from "./transactionCategory/transactionCategory.routes";
import { TransactionLabelRoutes } from "./transactionLabel/transactionLabel.routes";
import { PointRoutes } from "./point/point.routes";
import { MissionRoutes } from "./mission/mission.routes";
import { RewardRoutes } from "./reward/reward.routes";
import { NewsletterRoutes } from "./newsletter/newsletter.routes";
import { ScheduleRoutes } from "./schedule/schedule.routes";
import { TopUpRoutes } from "./topup/topup.routes";


const Routes = {
  applyRoutes: (app: express.Express) => {
    UserRoutes.register(app);
    VerificationsRoutes.register(app);
    TransactionCategoryRoutes.register(app);
    TransactionLabelRoutes.register(app);
    TransactionRoutes.register(app);
    PointRoutes.register(app);
    MissionRoutes.register(app);
    RewardRoutes.register(app);
    NewsletterRoutes.register(app);
    ScheduleRoutes.register(app);
    TopUpRoutes.register(app);
  },
};
export default Routes;
