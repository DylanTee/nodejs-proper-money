import * as TransactionCategoryQuery from "../../../libs/moongoose/query/transaction-category.query";
import { TTransactionCategory } from "../../../nodejs-proper-money-types/types";
import { removeStartAndEndSpaceInString } from "../../../libs/utils";
import { ETransactionCategoryType } from "../../../nodejs-proper-money-types/enum";

export default async function editTransactionCategory({
  userId,
  _id,
  name,
  type,
  backgroundColor,
  imagePath,
}: {
  userId: string;
  _id: string;
  name: string;
  type: ETransactionCategoryType;
  backgroundColor: string;
  imagePath: string;
}) {
  const doc = (await TransactionCategoryQuery.findOneWithId(
    _id
  )) as unknown as TTransactionCategory;
  if (doc && doc.userId == userId) {
    await TransactionCategoryQuery.updateOneWithId({
      _id: _id,
      data: {
        backgroundColor: backgroundColor,
        imagePath: imagePath,
        type: type,
        name: removeStartAndEndSpaceInString(name),
        updatedAt: new Date(),
      },
    });
  } else {
    throw Error("transaction category not found, invalid user token");
  }
}
