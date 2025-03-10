import * as TransactionQuery from "../../../libs/moongoose/query/transaction.query";
import * as TransactionCategoryQuery from "../../../libs/moongoose/query/transaction-category.query";
import * as TransactionLabelQuery from "../../../libs/moongoose/query/transaction-label.query";
import {
  TTimelineTransaction,
  TTransaction,
  TTransactionCategory,
  TTransactionLabel,
  TUser,
} from "../../../nodejs-proper-money-types/types";
import { getTimelineTransaction } from "../helper";
import * as UserQuery from "../../../libs/moongoose/query/user.query";

export default async function getTransactions({
  userId,
  startTransactedAt,
  endTransactedAt,
}: {
  startTransactedAt: string;
  endTransactedAt: string;
  userId: string;
}) {
  const userDoc = (await UserQuery.findOneById(userId)) as unknown as TUser;
  if (userDoc) {
    let startAt = new Date(new Date(startTransactedAt).toISOString());
    let endAt = new Date(
      new Date(endTransactedAt).toISOString().replace("000", "999")
    );
    const userTransactions = (await TransactionQuery.findWithDateRange({
      userId: userId,
      startTransactedAt: startAt,
      endTransactedAt: endAt,
    })) as unknown as TTransaction[];
    const userTransactionCategories =
      (await TransactionCategoryQuery.findTransactionCategoryWithUserId(
        userId
      )) as unknown as TTransactionCategory[];
    const userTransactionLabels = (await TransactionLabelQuery.findWithUserId(
      userId
    )) as unknown as TTransactionLabel[];
    const userTimelineTransactions = await getTimelineTransaction({
      transactions: userTransactions,
      startTransactedAt: startAt,
      endTransactedAt: endAt,
    });

    //sharedUser
    let sharedUserTransactions: TTransaction[] = [];
    let sharedUserTransactionCategories: TTransactionCategory[] = [];
    let sharedUserTransactionLabels: TTransactionLabel[] = [];
    let sharedUserTimelineTransactions: TTimelineTransaction[] = [];

    if (userDoc.sharedUserId) {
      sharedUserTransactions =
        ((await TransactionQuery.findWithDateRange({
          userId: userDoc.sharedUserId.toString(),
          startTransactedAt: startAt,
          endTransactedAt: endAt,
        })) as unknown as TTransaction[]) ?? [];
      sharedUserTransactionCategories =
        ((await TransactionCategoryQuery.findTransactionCategoryWithUserId(
          userDoc.sharedUserId.toString()
        )) as any) ?? [];
      sharedUserTransactionLabels =
        ((await TransactionLabelQuery.findWithUserId(
          userDoc.sharedUserId.toString()
        )) as unknown as TTransactionLabel[]) ?? [];

      sharedUserTimelineTransactions = await getTimelineTransaction({
        transactions: sharedUserTransactions,
        startTransactedAt: startAt,
        endTransactedAt: endAt,
      });
    }
    //total
    const totalTransactions = [
      ...userTransactions,
      ...sharedUserTransactions,
    ].sort(
      (a, b) =>
        new Date(b.transactedAt).getTime() - new Date(a.transactedAt).getTime()
    );
    const totalTransactionCategories = [
      ...userTransactionCategories,
      ...sharedUserTransactionCategories,
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const totalTransactionLabels = [
      ...userTransactionLabels,
      ...sharedUserTransactionLabels,
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const totalTimelineTransactions = getTimelineTransaction({
      transactions: totalTransactions,
      startTransactedAt: startAt,
      endTransactedAt: endAt,
    });
    return {
      user: {
        transactions: userTransactions,
        transactionCategories: userTransactionCategories,
        transactionLabels: userTransactionLabels,
        timelineTransactions: userTimelineTransactions,
      },
      sharedUser: {
        transactions: sharedUserTransactions,
        transactionCategories: sharedUserTransactionCategories,
        transactionLabels: sharedUserTransactionLabels,
        timelineTransactions: sharedUserTimelineTransactions,
      },
      total: {
        transactions: totalTransactions,
        transactionCategories: totalTransactionCategories,
        transactionLabels: totalTransactionLabels,
        timelineTransactions: totalTimelineTransactions,
      },
    };
  } else {
    throw Error("userDoc not found");
  }
}
