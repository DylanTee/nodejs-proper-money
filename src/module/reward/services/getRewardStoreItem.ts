import {
  TReward,
  TRewardStoreItem,
} from "../../../nodejs-proper-money-types/types";
import { ERewardType } from "../../../nodejs-proper-money-types/enum";
import { getRemainingRefreshTimeText } from "../../../libs/utils";
import { getTouchAndGoEwalletLeft, getStoreItemPrice } from "../helper";
import * as RewardQuery from "../../../libs/moongoose/query/reward.query";
import * as PointQuery from "../../../libs/moongoose/query/point.query";
import { MomentTimezoneLib } from "../../../libs/moment-timezone.lib";

export default async function getRewardStoreItem({
  userId,
}: {
  userId: string;
}) {
  const week =
    MomentTimezoneLib.getStartAndEndDatetimeByAsiaKualaLumpur("week");
  const month =
    MomentTimezoneLib.getStartAndEndDatetimeByAsiaKualaLumpur("month");

  const ticketHasOutOfStock =
    await PointQuery.findRewardStoreItemClaimableByUserId({
      userId,
      rewardType:
        ERewardType.reward_store_item_touch_and_go_ewallet_check_in_weekly_ticket,
      startCreatedAt: week.startAt,
      endCreatedAt: week.endAt,
    });
  const touchAndGoEwallet = (await RewardQuery.findByThisMonth(
    ERewardType.reward_store_item_touch_and_go_ewallet
  )) as unknown as TReward[];
  const list: TRewardStoreItem[] = [
    {
      name: "Touch'n Go eWallet",
      description: "Get randomised cash (between RM0.20 & RM10)",
      type: ERewardType.reward_store_item_touch_and_go_ewallet,
      price: getStoreItemPrice(
        ERewardType.reward_store_item_touch_and_go_ewallet
      ),
      refreshAt: getRemainingRefreshTimeText({
        lastDate: month.endAt,
        type: "month",
      }),
      inventoryLeft: getTouchAndGoEwalletLeft(touchAndGoEwallet),
    }
  ];
  return {
    rewardStoreItems: list,
  };
}
