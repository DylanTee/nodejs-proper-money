import { MomentTimezoneLib } from "../../../libs/moment-timezone.lib";
import { connection } from "../../../libs/moongoose/mongoose.lib";
import { ProperServices } from "../../../services/proper-services";
import {
  EPointFromType,
  EPointType,
  ERewardType,
} from "../../../nodejs-proper-money-types/enum";
import * as PointQuery from "../../../libs/moongoose/query/point.query";
import { getTouchAndGoEwalletLeft, getStoreItemPrice } from "../helper";
import * as RewardQuery from "../../../libs/moongoose/query/reward.query";
import * as PointAggregate from "../../../libs/moongoose/aggregate/point.aggregate";
import { TReward } from "../../../nodejs-proper-money-types/types";

export default async function redeemStoreItem({
  userId,
  rewardType,
}: {
  userId: string;
  rewardType: ERewardType;
}) {
  const week =
    MomentTimezoneLib.getStartAndEndDatetimeByAsiaKualaLumpur("week");
  let value = "";
  const session = await connection.startSession();
  await session.withTransaction(async () => {
    const getLeft = async () => {
      let rewards = (await RewardQuery.findByThisMonth(
        rewardType
      )) as unknown as TReward[];
      let ticketHasOutOfStock =
        await PointQuery.findRewardStoreItemClaimableByUserId({
          userId: userId,
          startCreatedAt: week.startAt,
          endCreatedAt: week.endAt,
          rewardType:
            ERewardType.reward_store_item_touch_and_go_ewallet_check_in_weekly_ticket,
        });
      if (rewardType == ERewardType.reward_store_item_touch_and_go_ewallet) {
        return getTouchAndGoEwalletLeft(rewards);
      } else if (
        rewardType ==
        ERewardType.reward_store_item_touch_and_go_ewallet_check_in_weekly_ticket
      ) {
        return ticketHasOutOfStock && ticketHasOutOfStock.length > 0 ? 0 : 1;
      } else {
        return 0;
      }
    };
    const totalPoints = await PointAggregate.getTotalPointsByUserId(userId);
    const invertoryLeft = await getLeft();
    const price = getStoreItemPrice(rewardType);
    if (totalPoints < price) {
      throw Error("Insufficient Points");
    } else if (invertoryLeft == 0) {
      throw Error("Sold out");
    } else {
      if (rewardType == ERewardType.reward_store_item_touch_and_go_ewallet) {
        function generateRandomRewardValue() {
          const randomNumber = Math.random() * 100;
          if (randomNumber < 99.918) {
            return (Math.random() * (0.39 - 0.2) + 0.2).toFixed(2);
          } else if (randomNumber < 99.919) {
            return (Math.random() * (0.99 - 0.4) + 0.4).toFixed(2);
          } else if (randomNumber < 99.929) {
            return (Math.random() * (1.99 - 1) + 1).toFixed(2);
          } else if (randomNumber < 99.939) {
            return (Math.random() * (2.99 - 2) + 2).toFixed(2);
          } else if (randomNumber < 99.949) {
            return (Math.random() * (3.99 - 3) + 3).toFixed(2);
          } else if (randomNumber < 99.959) {
            return (Math.random() * (4.99 - 4) + 4).toFixed(2);
          } else if (randomNumber < 99.969) {
            return (Math.random() * (5.99 - 5) + 5).toFixed(2);
          } else if (randomNumber < 99.979) {
            return (Math.random() * (6.99 - 6) + 6).toFixed(2);
          } else if (randomNumber < 99.989) {
            return (Math.random() * (7.99 - 7) + 7).toFixed(2);
          } else if (randomNumber < 99.999) {
            return (Math.random() * (8.99 - 8) + 8).toFixed(2);
          } else {
            return (Math.random() * (10 - 9) + 9).toFixed(2);
          }
        }
        const randomRewardValue = generateRandomRewardValue();
        const result = await RewardQuery.create({
          userId: userId,
          value: randomRewardValue,
          type: ERewardType.reward_store_item_touch_and_go_ewallet,
        });
        await PointQuery.create({
          userId,
          type: EPointType.deduct,
          value: price,
          pointFromType: EPointFromType.reward_item_store,
          pointFormId: null,
          missionType: ERewardType.reward_store_item_touch_and_go_ewallet,
        });
        value = randomRewardValue;
        ProperServices.sendNotificationToAdmin({
          title: "Proper Money Store",
          body: `RM ${randomRewardValue} has been redeem (${result.id})`,
        });
      } else if (
        rewardType ==
        ERewardType.reward_store_item_touch_and_go_ewallet_check_in_weekly_ticket
      ) {
        await PointQuery.create({
          userId,
          type: EPointType.deduct,
          value: price,
          pointFromType: EPointFromType.reward_item_store,
          pointFormId: null,
          missionType:
            ERewardType.reward_store_item_touch_and_go_ewallet_check_in_weekly_ticket,
        });
        ProperServices.sendNotificationToAdmin({
          title: "Proper Money Store",
          body: `User has been redeem touch and go weekly ticket (${userId})`,
        });
      }
    }
  });
  return {
    value: "RM " + value,
  };
}
