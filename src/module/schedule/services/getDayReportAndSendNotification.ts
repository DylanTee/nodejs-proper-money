import { MomentTimezoneLib } from "../../../libs/moment-timezone.lib";
import { ProperServices } from "../../../services/proper-services";
import * as PointQuery from "../../../libs/moongoose/query/point.query";
import * as UserQuery from "../../../libs/moongoose/query/user.query";

const getDayReportAndSendNotification = async () => {
  const { startAt, endAt } =
    MomentTimezoneLib.getStartAndEndDatetimeByAsiaKualaLumpur("today");
  const totalCountOfNewUserCreated =
    await UserQuery.findCountNewUserCreatedDaily({
      startCreatedAt: startAt,
      endCreatedAt: endAt,
    });
  const totalCountOfCheckIns =
    await PointQuery.findCountUserHasMissionDailyCheckIn({
      startCreatedAt: startAt,
      endCreatedAt: endAt,
    });
  const totalActiveUser = await UserQuery.findCountActiveUserDaily({
    startLastActiveAt: startAt,
    endLastActiveAt: endAt,
  });
  ProperServices.sendNotificationToAdmin({
    title: "Today Proper Money Users",
    body: `Active: ${totalActiveUser}\nCheck In: ${totalCountOfCheckIns}\nNew : ${totalCountOfNewUserCreated}`,
  });
};

export default getDayReportAndSendNotification;
