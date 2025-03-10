import * as TransactionQuery from "../../../libs/moongoose/query/transaction.query";
import { TMission } from "../../../nodejs-proper-money-types/types";
import { getPoint, getRemainingRefreshTimeText } from "../../../libs/utils";
import * as PointQuery from "../../../libs/moongoose/query/point.query";
import {
  EMissionType,
  ESubscriptionEntitlement,
} from "../../../nodejs-proper-money-types/enum";
import { MomentTimezoneLib } from "../../../libs/moment-timezone.lib";

const getMissions = async ({
  entitlement,
  userId,
}: {
  entitlement: ESubscriptionEntitlement;
  userId: string;
}) => {
  const today =
    MomentTimezoneLib.getStartAndEndDatetimeByAsiaKualaLumpur("today");
  const week =
    MomentTimezoneLib.getStartAndEndDatetimeByAsiaKualaLumpur("week");
  const dailyMissionIsClaimedOnCheckIn =
    await PointQuery.findMissionClaimablebyUserId({
      userId,
      missionType: EMissionType.dailyCheckIn,
      startCreatedAt: today.startAt,
      endCreatedAt: today.endAt,
    });
  const dailyAddTransaction = await TransactionQuery.findWithDateRange({
    userId,
    startTransactedAt: today.startAt,
    endTransactedAt: today.endAt,
  });
  const weeklyAddTransaction = await TransactionQuery.findWithDateRange({
    userId,
    startTransactedAt: week.startAt,
    endTransactedAt: week.endAt,
  });
  const dailyMissionIsClaimedOnAddTransaction =
    await PointQuery.findMissionClaimablebyUserId({
      userId,
      missionType: EMissionType.daiyAddIncomeOrExpense,
      startCreatedAt: today.startAt,
      endCreatedAt: today.endAt,
    });
  const weeklyMissionIsClaimableOnCheckIn =
    await PointQuery.findMissionClaimablebyUserId({
      userId,
      missionType: EMissionType.dailyCheckIn,
      startCreatedAt: week.startAt,
      endCreatedAt: week.endAt,
    });
  const weeklyMissionIsClaimedOnCheckIn =
    await PointQuery.findMissionClaimablebyUserId({
      userId,
      missionType: EMissionType.weeklyCheckIn,
      startCreatedAt: week.startAt,
      endCreatedAt: week.endAt,
    });
  const weeklyMissionIsClaimedOnAddTransaction =
    await PointQuery.findMissionClaimablebyUserId({
      userId,
      missionType: EMissionType.weeklyAddIncomeOrExpense,
      startCreatedAt: week.startAt,
      endCreatedAt: week.endAt,
    });

  if (
    dailyMissionIsClaimedOnCheckIn &&
    dailyMissionIsClaimedOnAddTransaction &&
    weeklyMissionIsClaimableOnCheckIn &&
    weeklyMissionIsClaimedOnCheckIn &&
    weeklyMissionIsClaimedOnAddTransaction
  ) {
    const dailyOfMissions: TMission[] = [
      {
        type: EMissionType.dailyCheckIn,
        description: "Daily Check in",
        isClaimable: true,
        isClaimed: dailyMissionIsClaimedOnCheckIn.length > 0 ? true : false,
        point: getPoint({
          missionType: EMissionType.dailyCheckIn,
          entitlement: entitlement,
        }),
        missionCount: {
          completedCount: 1,
          totalCount: 1,
        },
        isActive: true,
      },
      {
        type: EMissionType.daiyAddIncomeOrExpense,
        description: "Add 1 income or expense",
        isClaimable: dailyAddTransaction.length > 0 ? true : false,
        isClaimed:
          dailyMissionIsClaimedOnAddTransaction.length > 0 ? true : false,
        point: getPoint({
          missionType: EMissionType.daiyAddIncomeOrExpense,
          entitlement: entitlement,
        }),
        missionCount: {
          completedCount: dailyAddTransaction.length > 0 ? 1 : 0,
          totalCount: 1,
        },
        isActive: true,
      },
    ];
    const weeklyOfMissions: TMission[] = [
      {
        type: EMissionType.weeklyCheckIn,
        description: "Weekly Check-ins",
        isClaimable:
          weeklyMissionIsClaimableOnCheckIn.length >= 7 ? true : false,
        isClaimed: weeklyMissionIsClaimedOnCheckIn.length > 0 ? true : false,
        point: getPoint({
          missionType: EMissionType.weeklyCheckIn,
          entitlement: entitlement,
        }),
        missionCount: {
          completedCount:
            weeklyMissionIsClaimableOnCheckIn.length >= 7
              ? 7
              : weeklyMissionIsClaimableOnCheckIn.length,
          totalCount: 7,
        },
        isActive: true,
      },
      {
        type: EMissionType.weeklyAddIncomeOrExpense,
        description: "Add 14 income or expense",
        isClaimable: weeklyAddTransaction.length >= 14 ? true : false,
        isClaimed:
          weeklyMissionIsClaimedOnAddTransaction.length > 0 ? true : false,
        point: getPoint({
          missionType: EMissionType.weeklyAddIncomeOrExpense,
          entitlement: entitlement,
        }),
        missionCount: {
          completedCount:
            weeklyAddTransaction.length >= 14
              ? 14
              : weeklyAddTransaction.length,
          totalCount: 14,
        },
        isActive: true,
      },
    ];
    return {
      dailyMissions: {
        missions: dailyOfMissions,
        refreshAt: getRemainingRefreshTimeText({
          lastDate: today.endAt,
          type: "daily",
        }),
      },
      weeklyMissions: {
        missions: weeklyOfMissions,
        period: {
          startAt: week.startAt,
          endAt: week.endAt,
        },
        refreshAt: getRemainingRefreshTimeText({
          lastDate: week.endAt,
          type: "week",
        }),
      },
    };
  } else {
    throw Error(
      "dailyMissionIsClaimedOnCheckIn,dailyMissionIsClaimedOnAddTransaction,weeklyMissionIsClaimableOnCheckIn,weeklyMissionIsClaimedOnCheckIn,weeklyMissionIsClaimedOnAddTransaction not found"
    );
  }
};
export default getMissions;
