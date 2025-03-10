import * as UserQuery from "../../libs/moongoose/query/user.query";
import * as express from "express";
import { ProperServices } from "../../services/proper-services";

export const NewsletterRoutes = {
  register: (app: express.Application) => {
    const router = express.Router();
    router.post("/newsletter/sendWeMissYouMail", async function (req, res) {
      try {
        const users = await UserQuery.findUserNotActive({
          isEmailAddress: true,
          isPhoneNumber: false,
        });
        if (users.length > 0) {
          users.map((user, index) => {
            setTimeout(() => {
              let subject = "";
              let html = "";
              if (user.language == "cn") {
                subject =
                  "[Proper Money] 我们想念您！获得 7 天免费试用高级会员资格。";
                html = `<html><head><title>Proper Money</title></head><body><div style="max-width: 600px; margin: 0 auto; padding: 20px;"><img src="https://twenty4sevenappbucket.s3.ap-southeast-1.amazonaws.com/propermoney/newsletter/Free-Premium.png" alt="App Logo" style="max-width: 50%; height: auto; display: block; margin-bottom: 20px;"><h2>什么是Premium会员? 🤔</h2><p>我们想念您！您可以享受 7 天免费试用的无限制高级会员！😍 </p><ul><li>一起分享和追踪支出 👫</li><li>使用 Photo AI 扫描发票 📷</li><li>使用分类和多个标签整理您的交易 ✅</li><li>以 Excel 导出交易 📁</li></ul><p>重新登录即可免费获取，不要错过这些惊人的特权！保持联系，充分利用您的会员资格。</p><p>最好的问候, <br>Proper Money 团队</p></div></body></html>`;
              } else {
                subject =
                  "[Proper Money] We miss you! Get 7 days FREE trial Premium membership.";
                html = `<html><head><title>Proper Money</title></head><body><div style="max-width: 600px; margin: 0 auto; padding: 20px;"><img src="https://twenty4sevenappbucket.s3.ap-southeast-1.amazonaws.com/propermoney/newsletter/Free-Premium.png" alt="App Logo" style="max-width: 50%; height: auto; display: block; margin-bottom: 20px;"><h2>What is Premium membership? 🤔</h2><p>We miss you! you can enjoy Premium membership without limits with 7 days FREE trial! 😍</p><ul><li>Share & Track Spending Together 👫</li><li>Photo AI scan invoices with ease 📷</li><li>Organize your transactions with category and multiple labels ✅</li><li>Export transactions in excel 📁</li></ul><p>Log in back and get it for FREE, don't miss out on these amazing perks! Stay connected and make the most out of your membership.</p><p>Best regards,<br>Proper Money Team</p></div></body></html>`;
              }
              ProperServices.mailSend({
                from: "aksoonz@gmail.com",
                to: user.emailAddress,
                subject: subject,
                text: "text",
                html: html,
              });
            }, (index + 1) * 1000);
          });
        }
        return res.status(200).send(true);
      } catch (e) {
        return res.status(500).json({ error: e.message });
      }
    });
    router.post(
      "/newsletter/sendWeMissYouPhoneNumber",
      async function (req, res) {
        try {
          const users = await UserQuery.findUserNotActive({
            isEmailAddress: false,
            isPhoneNumber: true,
          });
          if (users.length > 0)
            users.map((user, index) => {
              setTimeout(() => {
                let body = "";
                if (user.language == "cn") {
                  body =
                    "[Proper Money] 我们想念您！获得 7 天免费试用高级会员资格. 登录并领取.";
                } else {
                  body =
                    "[Proper Money] We miss you! GET 7 days FREE Premium membership. Login to redeem.";
                }
                ProperServices.sendMessage({
                  body: body,
                  to: user.phoneNumber,
                });
              }, (index + 1) * 1000);
            });
          return res.status(200).send(true);
        } catch (e) {
          return res.status(500).json({ error: e.message });
        }
      }
    );
    app.use("", router);
  },
};
