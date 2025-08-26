import { Request, Response } from "express";
import { initiatePayment, updatePaymentStatus } from "../services/payment.service";

export const createPayment = async (req: Request, res: Response) => {
  try {
    const payment = await initiatePayment(req.body);
    res.status(201).json(payment);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const setPaymentStatus = async (req: Request, res: Response) => {
  try {
    const payment = await updatePaymentStatus(Number(req.params.id), req.body.status);
    res.json(payment);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
