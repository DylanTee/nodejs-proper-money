import * as UserQuery from "../../../libs/moongoose/query/user.query";
import { TUser } from "../../../nodejs-proper-money-types/types";
import { MomentTimezoneLib } from "../../../libs/moment-timezone.lib";
import { UserServices } from ".";

export default async function detail(userId: string) {
  try {
    const user = (await UserQuery.findOneById(userId)) as unknown as TUser;
    const lastActiveDay = MomentTimezoneLib.getStartAndEndOfDay(
      user.lastActiveAt
    );
    const today = MomentTimezoneLib.getStartAndEndOfDay(new Date());
    const isInActiveUser =
      today.startAt.getTime() - lastActiveDay.startAt.getTime() >= 2678400000;
    let premiumMemberTrialEndAt = user.premiumMemberTrialEndAt;
    if (user.premiumMemberTrialEndAt) {
      if (new Date() >= user.premiumMemberTrialEndAt) {
        premiumMemberTrialEndAt = null;
      }
    } else if (isInActiveUser && user.topUpMemberRole == null) {
      premiumMemberTrialEndAt = MomentTimezoneLib.addSevenDays(today.endAt); // inactive more than 30 days, free 7 day trial premium member
    }
    await UserServices.updateUser({
      userId: userId,
      data: {
        lastActiveAt: new Date(),
        premiumMemberTrialEndAt: premiumMemberTrialEndAt,
      },
    }); //for track active user purpose
    return user;
  } catch (e) {
    throw e;
  }
}
