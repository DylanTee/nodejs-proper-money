import { MomentTimezoneLib } from "../../../libs/moment-timezone.lib";
import { connection } from "../../../libs/moongoose/mongoose.lib";
import {
  EMissionType,
  EPointFromType,
  EPointType,
  ESubscriptionEntitlement,
} from "../../../nodejs-proper-money-types/enum";
import * as PointQuery from "../../../libs/moongoose/query/point.query";
import { getPoint } from "../../../libs/utils";

export default async function claimPoint({
  userId,
  missionType,
  entitlement,
}: {
  userId: string;
  missionType: EMissionType;
  entitlement: ESubscriptionEntitlement;
}) {
  try {
    const session = await connection.startSession();
    await session.withTransaction(
      async () => {
        const addPoint = async () => {
          const points = getPoint({ missionType, entitlement });
          await PointQuery.create({
            userId,
            type: EPointType.add,
            value: points,
            missionType,
            pointFromType: EPointFromType.mission,
            pointFormId: null,
          });
        };
        const today =
          MomentTimezoneLib.getStartAndEndDatetimeByAsiaKualaLumpur("today");
        const week =
          MomentTimezoneLib.getStartAndEndDatetimeByAsiaKualaLumpur("week");
        let startAt = new Date();
        let endAt = new Date();
        if (
          [
            EMissionType.dailyCheckIn,
            EMissionType.daiyAddIncomeOrExpense,
          ].includes(missionType)
        ) {
          startAt = today.startAt;
          endAt = today.endAt;
        } else if (
          [
            EMissionType.weeklyCheckIn,
            EMissionType.weeklyAddIncomeOrExpense,
          ].includes(missionType)
        ) {
          startAt = week.startAt;
          endAt = week.endAt;
        }
        const docs = await PointQuery.findMissionClaimablebyUserId({
          userId,
          missionType,
          startCreatedAt: startAt,
          endCreatedAt: endAt,
        });
        if (docs && docs.length == 0) {
          await addPoint();
        }
      },
      {
        readPreference: "primary",
        readConcern: { level: "local" },
        writeConcern: { w: "majority" },
      }
    );
  } catch (e) {
    throw e;
  }
}
