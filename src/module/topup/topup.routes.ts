import * as express from "express";
import { TPostTopUpCreateReferenceBody } from "../../nodejs-proper-money-types/types";
import ZodLib from "../../libs/zod.lib";
import axios from "axios";
import * as BillplzQuery from "../../libs/moongoose/query/billplz.query";
import * as IPayEightyEightQuery from "../../libs/moongoose/query/ipayeightyeight.query";
import { TopUpServices } from "./services";

export const TopUpRoutes = {
  register: (app: express.Application) => {
    const router = express.Router();
    router.post("/topup/createBill", async function (req, res) {
      ZodLib.isString(req.body.userId);
      ZodLib.isString(req.body.productId);
      ZodLib.isString(req.body.description);
      ZodLib.isString(req.body.name);
      ZodLib.isString(req.body.email);
      ZodLib.isString(req.body.amount);
      try {
        const response = await axios.post(
          "https://pr0per.app/api-proper-golang/bill/create",
          req.body
        );
        const jsonString = Buffer.from(response.data, "base64").toString(
          "utf-8"
        );
        const jsonObject = JSON.parse(jsonString);
        if (typeof jsonObject === "object") {
          await BillplzQuery.create({
            userId: req.body.userId,
            productId: req.body.productId,
            bill: jsonObject,
          });
        } else {
          throw Error("golang server error or create billplz query error");
        }
        const result = jsonObject;
        return res.status(200).send(result);
      } catch (e) {
        return res.status(500).json({ error: e.message });
      }
    });
    router.post("/topup/webhook", async function (req, res) {
      try {
        const doc = await BillplzQuery.findOneByBillId(req.body.id);
        await BillplzQuery.updateOneByBillId({
          billId: req.body.id,
          data: {
            payment: req.body,
            updatedAt: new Date(),
          },
        });
        if (doc && req.body.paid == "true") {
          await TopUpServices.updateUserMemberTopUp({
            userId: doc.userId,
            productId: doc.productId,
          });
        }
        const result = doc;
        return res.status(200).send(result);
      } catch (e) {
        return res.status(500).json({ error: e.message });
      }
    });
    router.post("/topup/createReference", async function (req, res) {
      ZodLib.isString(req.body.userId);
      ZodLib.isString(req.body.productId);
      ZodLib.isString(req.body.referenceNo);
      const body: TPostTopUpCreateReferenceBody = {
        userId: req.body.userId,
        productId: req.body.productId,
        referenceNo: req.body.referenceNo,
      };
      try {
        await IPayEightyEightQuery.create(body);
        return res.status(200).send(true);
      } catch (e) {
        return res.status(500).json({ error: e.message });
      }
    });
    //ipay88
    // router.post("", async function (req, res) {
    //     iPayEightyEightResponse: req.body.iPayEightyEightResponse,
    //     iPayEightyEightBackend: req.body.iPayEightyEightBackend,
    //   try {
    //     const data: any =
    //       body.iPayEightyEightResponse != null
    //         ? body.iPayEightyEightResponse
    //         : body.iPayEightyEightBackend;
    //     await IPayEightyEightQuery.updateOneWithReferenceNo({
    //       referenceNo: data.RefNo,
    //       data: {
    //         iPayEightyEightResponse: body.iPayEightyEightResponse,
    //         iPayEightyEightBackend: body.iPayEightyEightBackend,
    //         updatedAt: new Date(),
    //       },
    //     });
    //     if (data.Status == "1" && body.iPayEightyEightResponse) {
    //       const doc = await IPayEightyEightQuery.findOneWithReferenceNo(
    //         data.RefNo
    //       );
    //       TopUpServices.updateUserMemberTopUp({
    //         productId: doc?.productId ?? "",
    //         userId: doc?.userId ?? "",
    //       });
    //     }
    //     return res.status(200).send(true);
    //   } catch (e) {
    //     return res.status(500).json({ error: e.message });
    //   }
    // });
    app.use("", router);
  },
};
