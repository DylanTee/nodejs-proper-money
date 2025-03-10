import * as TransactionQuery from "../../../libs/moongoose/query/transaction.query";
import * as TransactionLabelQuery from "../../../libs/moongoose/query/transaction-label.query";
import { TTransactionLabel } from "../../../nodejs-proper-money-types/types";

export default async function deleteTransactionLabelById({
  userId,
  _id,
}: {
  userId: string;
  _id: string;
}) {
  const doc = (await TransactionLabelQuery.findOneWithId(
    _id
  )) as unknown as TTransactionLabel;
  const transactionDoc = await TransactionQuery.findOneWithTransactionLabelId(
    _id
  );
  if (doc && doc.userId != userId) {
    throw Error("transaction label not found and invalid user token");
  } else if (transactionDoc) {
    throw Error(`${doc?.name} cannot be delete, because it in used`);
  } else {
    await TransactionLabelQuery.updateOneWithId({
      _id: _id,
      data: { isDeleted: true, updatedAt: new Date() },
    });
  }
}
