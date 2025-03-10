import { Model } from "../mongoose.lib";

export async function create({
  userId,
  productId,
  bill,
}: {
  userId: string;
  productId: string;
  bill: any;
}) {
  return await Model.Billplz.create({
    userId,
    productId,
    bill,
  });
}

export async function findOneByBillId(billId: string) {
  return await Model.Billplz.collection.findOne({
    "bill.id": billId,
  });
}

export async function updateOneByBillId({
  billId,
  data,
}: {
  billId: string;
  data: any;
}) {
  return await Model.Billplz.collection.findOneAndUpdate(
    {
      "bill.id": billId,
    },
    {
      $set: data,
    }
  );
}
