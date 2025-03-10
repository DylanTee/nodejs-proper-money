import { Model } from "../mongoose.lib";

export async function create({
  userId,
  productId,
  referenceNo,
}: {
  userId: string;
  productId: string;
  referenceNo: string;
}) {
  return await Model.IPayEightyEight.create({
    userId,
    productId,
    referenceNo,
  });
}

export async function findOneWithReferenceNo(referenceNo: string) {
  return await Model.IPayEightyEight.collection.findOne({
    referenceNo,
  });
}

export async function updateOneWithReferenceNo({
  referenceNo,
  data,
}: {
  referenceNo: string;
  data: any;
}) {
  return await Model.IPayEightyEight.collection.findOneAndUpdate(
    {
      referenceNo: referenceNo,
    },
    {
      $set: data,
    }
  );
}
