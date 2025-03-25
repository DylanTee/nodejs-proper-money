import { MomentTimezoneLib } from "../../../libs/moment-timezone.lib";
import { ESubscriptionEntitlement } from "../../../nodejs-proper-money-types/enum";
import { UserServices } from "../../user/services";


export default async function updateUserMemberTopUp({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) {
  let role = null;
  let endAt = null;

  if (productId == "member_plus_monthly") {
    role = ESubscriptionEntitlement.plus;
    endAt = MomentTimezoneLib.addOneMonth(new Date());
  }

  if (productId == "member_premium_monthly") {
    role = ESubscriptionEntitlement.premium;
    endAt = MomentTimezoneLib.addOneMonth(new Date());
  }

  if (productId == "member_plus_yearly") {
    role = ESubscriptionEntitlement.plus;
    endAt = MomentTimezoneLib.addOneYear(new Date());
  }

  if (productId == "member_premium_yearly") {
    role = ESubscriptionEntitlement.premium;
    endAt = MomentTimezoneLib.addOneYear(new Date());
  }
}
