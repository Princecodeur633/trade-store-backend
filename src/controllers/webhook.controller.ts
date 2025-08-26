import { Request, Response } from "express";
import { updatePaymentStatus } from "../services/payment.service";
import { successResponse, errorResponse } from "../utils/response";
import { AUDIT_ACTIONS } from "../utils/constants";
import { logAction } from "../services/audit.service";

/**
 * Webhook Stripe → simulation
 */
export const stripeWebhook = async (req: Request, res: Response) => {
  try {
    const event = req.body;

    // Exemple : on mappe un paiement Stripe à notre DB
    if (event.type === "payment_intent.succeeded") {
      const transactionId = event.data.object.id;
      await updatePaymentStatusByTransaction(transactionId, "PAID");
      await logAction(null, AUDIT_ACTIONS.PAYMENT_SUCCESS, `Stripe payment ${transactionId} succeeded`);
    } else if (event.type === "payment_intent.payment_failed") {
      const transactionId = event.data.object.id;
      await updatePaymentStatusByTransaction(transactionId, "FAILED");
      await logAction(null, AUDIT_ACTIONS.PAYMENT_FAILED, `Stripe payment ${transactionId} failed`);
    }

    return res.status(200).send("Stripe webhook received");
  } catch (err: any) {
    return errorResponse(res, err, 400);
  }
};

/**
 * Webhook PayPal → simulation
 */
export const paypalWebhook = async (req: Request, res: Response) => {
  try {
    const event = req.body;

    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const transactionId = event.resource.id;
      await updatePaymentStatusByTransaction(transactionId, "PAID");
      await logAction(null, AUDIT_ACTIONS.PAYMENT_SUCCESS, `PayPal payment ${transactionId} completed`);
    } else if (event.event_type === "PAYMENT.CAPTURE.DENIED") {
      const transactionId = event.resource.id;
      await updatePaymentStatusByTransaction(transactionId, "FAILED");
      await logAction(null, AUDIT_ACTIONS.PAYMENT_FAILED, `PayPal payment ${transactionId} denied`);
    }

    return res.status(200).send("PayPal webhook received");
  } catch (err: any) {
    return errorResponse(res, err, 400);
  }
};

/**
 * Webhook Mobile Money → simulation
 */
export const mobileMoneyWebhook = async (req: Request, res: Response) => {
  try {
    const { transaction_id, status } = req.body;

    await updatePaymentStatusByTransaction(transaction_id, status.toUpperCase());
    await logAction(null, AUDIT_ACTIONS.PAYMENT_UPDATED, `Mobile Money transaction ${transaction_id} → ${status}`);

    return successResponse(res, { transaction_id, status }, "Mobile Money webhook processed");
  } catch (err: any) {
    return errorResponse(res, err, 400);
  }
};

// helper
async function updatePaymentStatusByTransaction(transactionId: string, status: string) {
  const { default: Payment } = await import("../models/Payment");
  const payment = await Payment.findOne({ where: { transaction_id: transactionId } });
  if (payment) {
    await payment.update({ status });
  }
}
