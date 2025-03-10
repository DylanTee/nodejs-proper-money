require("dotenv").config();
import axios from "axios";
import {
  TTwilioSendCodeForWhatsappsBody,
  TTwilioSendMessageBody,
} from "@mcdylanproperenterprise/nodejs-proper-types/twilio";
import { TMailSendBody } from "@mcdylanproperenterprise/nodejs-proper-types/mail";
import {
  TFCMsendNotificationBody,
  TFCMsendNotificationToAdminBody,
} from "@mcdylanproperenterprise/nodejs-proper-types/fcm";

const axiosClient = axios.create({
  baseURL: `https://www.pr0per.app/api-proper`,
  headers: {
    "x-api-key": process.env.PROPER_API_KEY,
  },
});

const sendCodeForWhatsapps = async ({
  to,
  code,
}: TTwilioSendCodeForWhatsappsBody) => {
  try {
    const response = await axiosClient({
      url: "/twilio/sendCodeForWhatsapps",
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      data: {
        to,
        code,
      },
    });
    return response.data;
  } catch (e) {
    throw e;
  }
};

const sendMessage = async ({ body, to }: TTwilioSendMessageBody) => {
  try {
    await axiosClient({
      url: "/twilio/sendMessage",
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      data: {
        to,
        body,
      },
    });
  } catch (e) {
    throw e;
  }
};

const mailSend = async ({
  from,
  to,
  subject,
  text,
  html,
  attachments,
}: TMailSendBody) => {
  try {
    await axiosClient({
      url: "/mail/send",
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      data: {
        from,
        to,
        subject,
        text,
        html,
        attachments,
      },
    });
  } catch (e) {
    throw e;
  }
};

const sendNotification = async ({
  title,
  body,
  token,
}: TFCMsendNotificationBody) => {
  try {
    const response = await axiosClient({
      url: "/fcm/sendNotification",
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      data: {
        title,
        body,
        token,
      },
    });
    return response.data;
  } catch (e) {
    throw e;
  }
};

const sendNotificationToAdmin = async ({
  title,
  body,
}: TFCMsendNotificationToAdminBody) => {
  try {
    const response = await axiosClient({
      url: "/fcm/sendNotificationToAdmin",
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      data: {
        title,
        body,
      },
    });
    return response.data;
  } catch (e) {
    throw e;
  }
};

export const ProperServices = {
  sendCodeForWhatsapps,
  mailSend,
  sendMessage,
  sendNotification,
  sendNotificationToAdmin,
};
