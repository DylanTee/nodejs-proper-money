import { TReward } from "../../nodejs-proper-money-types/types";
import { ERewardType } from "../../nodejs-proper-money-types/enum";

export const getStoreItemPrice = (rewardType: ERewardType) => {
  if (rewardType == ERewardType.reward_store_item_touch_and_go_ewallet) {
    return 48000;
  } else if (
    rewardType ==
    ERewardType.reward_store_item_touch_and_go_ewallet_check_in_weekly_ticket
  ) {
    return 0;
  } else {
    return 0;
  }
};

export const getTouchAndGoEwalletLeft = (rewards: TReward[] | undefined) => {
  if (rewards) {
    if (rewards.length >= 15) {
      return 0;
    } else {
      return 15 - rewards.length;
    }
  } else {
    return 0;
  }
};
