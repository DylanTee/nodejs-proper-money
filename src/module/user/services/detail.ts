import * as UserQuery from "../../../libs/moongoose/query/user.query";

export default async function detail(userId: string) {
  try {
    const user = await UserQuery.findOneById(userId);
    return user;
  } catch (e) {
    throw e;
  }
}
