import {
  TTimelineTransaction,
  TTransaction,
} from "../../nodejs-proper-money-types/types";
import { getUniqueArrayOfObject } from "../../libs/utils";
import { ETransactionCategoryType } from "../../nodejs-proper-money-types/enum";

export const getTimelineTransaction = ({
  transactions,
  startTransactedAt,
  endTransactedAt,
}: {
  transactions: TTransaction[];
  startTransactedAt: Date;
  endTransactedAt: Date;
}) => {
  const getList = ({
    transactions,
    startTransactedAt,
    endTransactedAt,
  }: {
    transactions: TTransaction[];
    startTransactedAt: Date;
    endTransactedAt: Date;
  }) => {
    return transactions.filter(
      (data) =>
        new Date(startTransactedAt).getTime() <=
          new Date(data.transactedAt).getTime() &&
        new Date(endTransactedAt).getTime() >=
          new Date(data.transactedAt).getTime()
    );
  };
  const arr: string[] = [startTransactedAt.toJSON()];
  for (let i = 1; i < endTransactedAt.getDate(); i++) {
    arr.push(
      endTransactedAt.getFullYear() +
        "-" +
        ((endTransactedAt.getMonth() + 1).toString().length == 1
          ? "0" + (endTransactedAt.getMonth() + 1)
          : endTransactedAt.getMonth() + 1) +
        "-" +
        (i.toString().length == 1 ? "0" + i : i) +
        startTransactedAt.toJSON().slice(10, 24)
    );
  }
  const datas: TTimelineTransaction[] = getUniqueArrayOfObject(
    arr.map((z) => ({
      startTransactedAt: z,
      endTransactedAt: new Date(
        new Date(z).getTime() + 24 * 60 * 60 * 999.99999
      ),
    }))
  ).map((y) => {
    const listGroupDate = getList({
      startTransactedAt: y.startTransactedAt,
      endTransactedAt: y.endTransactedAt,
      transactions: transactions,
    });


    const currencies = [...new Set(listGroupDate.map((data) => data.currency))].map((currency) => ({
      currency,
      totalIncomes: listGroupDate
        .filter(
          (y) =>
            y.currency == currency &&
            y.transactionCategory.type == ETransactionCategoryType.income
        )
        .map((i) => i.amount)
        .reduce((a, b) => a + b, 0),
        totalExpenses: listGroupDate
        .filter(
          (y) =>
            y.currency == currency &&
            y.transactionCategory.type == ETransactionCategoryType.expense
        )
        .map((i) => i.amount)
        .reduce((a, b) => a + b, 0),
    }));
    return {
      date: y.startTransactedAt,
      records: listGroupDate,
      totalIncome: 0, //DEPRECATED
      totalExpense: 0, //DEPRECATED
      totalCurrenciesIncomeAndExpenses:currencies
    };
  });
  return datas;
};
