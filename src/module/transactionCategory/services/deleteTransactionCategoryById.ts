import * as TransactionQuery from "../../../libs/moongoose/query/transaction.query";
import * as TransactionCategoryQuery from "../../../libs/moongoose/query/transaction-category.query";
import { TTransactionCategory } from "../../../nodejs-proper-money-types/types";

export default async function deleteTransactionCategoryById({
  userId,
  _id,
}: {
  userId: string;
  _id: string;
}) {
  const doc = (await TransactionCategoryQuery.findOneWithId(
    _id
  )) as unknown as TTransactionCategory;
  const transactionDoc =
    await TransactionQuery.findOneWithTransactionCategoryId(_id);
  if (doc && doc.userId != userId) {
    throw Error("transaction category not found && invalid user token");
  } else if (transactionDoc) {
    throw Error(`${doc?.name} cannot be delete, because it in used`);
  } else {
    await TransactionCategoryQuery.updateOneWithId({
      _id: _id,
      data: { isDeleted: true, updatedAt: new Date() },
    });
  }
}
