import request from "supertest";
import app from "../src/app";
import sequelize from "../src/config/db";
import { adminToken, merchantToken, clientToken } from "./auth.test";

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Notifications API", () => {
  it("MERCHANT can send a notification", async () => {
    const res = await request(app)
      .post("/api/notifications")
      .set("Authorization", `Bearer ${merchantToken}`)
      .send({
        channel: "EMAIL",
        recipient: "client@test.com",
        message: "Your invoice is ready"
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.status).toBe("SENT");
  });

  it("ADMIN can list notifications", async () => {
    const res = await request(app)
      .get("/api/notifications")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("CLIENT should not be allowed to list notifications", async () => {
    const res = await request(app)
      .get("/api/notifications")
      .set("Authorization", `Bearer ${clientToken}`);

    expect(res.statusCode).toEqual(403);
  });
});
