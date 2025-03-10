import { TUser } from "../../../nodejs-proper-money-types/types";
import * as UserQuery from "../../../libs/moongoose/query/user.query";

export default async function updateUser({
  userId,
  data,
}: {
  userId: string;
  data: Partial<TUser>;
}) {
  try {
    const user = await UserQuery.updateOneById({
      _id: userId,
      data: data,
    });
    if (user) {
      return user;
    } else {
      throw Error("User not found");
    }
  } catch (e) {
    throw e;
  }
}
