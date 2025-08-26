import { Request, Response } from "express";
import { sendNotification } from "../services/notification.service";
import { successResponse, createdResponse, errorResponse } from "../utils/response";
import { AUDIT_ACTIONS } from "../utils/constants";
import { logAction } from "../services/audit.service";

export const createNotification = async (req: Request, res: Response) => {
  try {
    const notification = await sendNotification(req.body);

    // Log action
    await logAction(req.user?.id, AUDIT_ACTIONS.NOTIFICATION_SENT, `Notification sent to ${notification.recipient}`);

    return createdResponse(res, notification, "Notification sent successfully");
  } catch (err: any) {
    return errorResponse(res, err, 400);
  }
};

export const listNotifications = async (_req: Request, res: Response) => {
  try {
    // TODO: add pagination later
    const notifications = await (await import("../models/Notification")).default.findAll();
    return successResponse(res, notifications);
  } catch (err: any) {
    return errorResponse(res, err, 400);
  }
};
