import request from "supertest";
import app from "../src/app";
import sequelize from "../src/config/db";
import { adminToken, merchantToken } from "./auth.test"; // réutilise les tokens

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Payments API", () => {
  let paymentId: number;

  it("MERCHANT can create a new payment", async () => {
    const res = await request(app)
      .post("/api/payments")
      .set("Authorization", `Bearer ${merchantToken}`)
      .send({
        method: "STRIPE",
        transaction_id: "txn_test123",
        amount: 100.0,
        currency: "USD"
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.method).toBe("STRIPE");
    paymentId = res.body.data.id;
  });

  it("ADMIN can update payment status", async () => {
    const res = await request(app)
      .patch(`/api/payments/${paymentId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "PAID" });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.status).toBe("PAID");
  });

  it("CLIENT should be forbidden to create a payment", async () => {
    const res = await request(app)
      .post("/api/payments")
      .set("Authorization", "Bearer fakeClientToken") // TODO: inject clientToken
      .send({
        method: "PAYPAL",
        transaction_id: "txn_fail123",
        amount: 50.0,
        currency: "USD"
      });

    expect(res.statusCode).toEqual(403);
  });
});
