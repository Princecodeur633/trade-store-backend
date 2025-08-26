import Notification from "../models/Notification";

export const sendNotification = async (data: any) => {
  // TODO: intégrer Twilio / SendGrid
  const notif = await Notification.create({ ...data, status: "SENT" });
  return notif;
};
