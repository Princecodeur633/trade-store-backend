import { Request, Response } from "express";
import { initiatePayment, updatePaymentStatus } from "../services/payment.service";
import { successResponse, createdResponse, errorResponse } from "../utils/response";
import { AUDIT_ACTIONS } from "../utils/constants";
import { logAction } from "../services/audit.service";

export const createPayment = async (req: Request, res: Response) => {
  try {
    const payment = await initiatePayment(req.body);

    // Log action
    await logAction(req.user?.id, AUDIT_ACTIONS.PAYMENT_INITIATED, `Payment ${payment.id} initiated`);

    return createdResponse(res, payment, "Payment created successfully");
  } catch (err: any) {
    return errorResponse(res, err, 400);
  }
};

export const setPaymentStatus = async (req: Request, res: Response) => {
  try {
    const payment = await updatePaymentStatus(Number(req.params.id), req.body.status);

    // Log action
    const action =
      req.body.status === "PAID" ? AUDIT_ACTIONS.PAYMENT_SUCCESS : AUDIT_ACTIONS.PAYMENT_FAILED;
    await logAction(req.user?.id, action, `Payment ${payment.id} updated to ${req.body.status}`);

    return successResponse(res, payment, "Payment status updated");
  } catch (err: any) {
    return errorResponse(res, err, 400);
  }
};
