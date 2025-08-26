import Payment from "../models/Payment";

export const initiatePayment = async (data: any) => {
  return await Payment.create(data);
};

export const updatePaymentStatus = async (id: number, status: string) => {
  const payment = await Payment.findByPk(id);
  if (!payment) throw new Error("Payment not found");
  payment.status = status;
  await payment.save();
  return payment;
};
