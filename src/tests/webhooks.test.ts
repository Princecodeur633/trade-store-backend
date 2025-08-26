import request from "supertest";
import app from "../src/app";
import sequelize from "../src/config/db";
const Payment = require("../src/models/Payment");

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // On insère un paiement fictif qui sera mis à jour par les webhooks
  await Payment.create({
    method: "STRIPE",
    transaction_id: "txn_stripe_123",
    amount: 100,
    currency: "USD",
    status: "PENDING"
  });

  await Payment.create({
    method: "PAYPAL",
    transaction_id: "txn_paypal_123",
    amount: 200,
    currency: "USD",
    status: "PENDING"
  });

  await Payment.create({
    method: "MOBILE_MONEY",
    transaction_id: "txn_momo_123",
    amount: 50,
    currency: "XAF",
    status: "PENDING"
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Webhook Stripe", () => {
  it("should update payment to PAID when Stripe succeeds", async () => {
    const res = await request(app)
      .post("/api/webhooks/stripe")
      .send({
        type: "payment_intent.succeeded",
        data: { object: { id: "txn_stripe_123" } }
      });

    expect(res.statusCode).toBe(200);

    const updated = await Payment.findOne({ where: { transaction_id: "txn_stripe_123" } });
    expect(updated?.status).toBe("PAID");
  });

  it("should update payment to FAILED when Stripe fails", async () => {
    const res = await request(app)
      .post("/api/webhooks/stripe")
      .send({
        type: "payment_intent.payment_failed",
        data: { object: { id: "txn_stripe_123" } }
      });

    expect(res.statusCode).toBe(200);

    const updated = await Payment.findOne({ where: { transaction_id: "txn_stripe_123" } });
    expect(updated?.status).toBe("FAILED");
  });
});

describe("Webhook PayPal", () => {
  it("should update payment to PAID when PayPal completed", async () => {
    const res = await request(app)
      .post("/api/webhooks/paypal")
      .send({
        event_type: "PAYMENT.CAPTURE.COMPLETED",
        resource: { id: "txn_paypal_123" }
      });

    expect(res.statusCode).toBe(200);

    const updated = await Payment.findOne({ where: { transaction_id: "txn_paypal_123" } });
    expect(updated?.status).toBe("PAID");
  });

  it("should update payment to FAILED when PayPal denied", async () => {
    const res = await request(app)
      .post("/api/webhooks/paypal")
      .send({
        event_type: "PAYMENT.CAPTURE.DENIED",
        resource: { id: "txn_paypal_123" }
      });

    expect(res.statusCode).toBe(200);

    const updated = await Payment.findOne({ where: { transaction_id: "txn_paypal_123" } });
    expect(updated?.status).toBe("FAILED");
  });
});

describe("Webhook Mobile Money", () => {
  it("should update payment status according to payload", async () => {
    const res = await request(app)
      .post("/api/webhooks/mobile-money")
      .send({
        transaction_id: "txn_momo_123",
        status: "paid"
      });

    expect(res.statusCode).toBe(200);

    const updated = await Payment.findOne({ where: { transaction_id: "txn_momo_123" } });
    expect(updated?.status).toBe("PAID");
  });
});
