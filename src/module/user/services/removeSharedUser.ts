import { TUser } from "../../../nodejs-proper-money-types/types";
import * as UserQuery from "../../../libs/moongoose/query/user.query";
import { UserServices } from ".";

export default async function removeSharedUser({
  sharedUserId,
  userId,
}: {
  sharedUserId: string;
  userId: string;
}) {
  const userDoc = (await UserQuery.findOneById(userId)) as unknown as TUser;
  if (userDoc && userDoc.sharedUserId == sharedUserId) {
    await UserServices.updateUser({
      userId: userId,
      data: {
        sharedUserId: null,
      },
    });
  }
  const sharedUserDoc = (await UserQuery.findOneById(
    sharedUserId
  )) as unknown as TUser;
  if (sharedUserDoc && sharedUserDoc.sharedUserId == userId) {
    await UserServices.updateUser({
      userId: sharedUserId,
      data: {
        sharedUserId: null,
      },
    });
  }
}
