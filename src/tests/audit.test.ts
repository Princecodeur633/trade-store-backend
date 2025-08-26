import request from "supertest";
import app from "../src/app";
import sequelize from "../src/config/db";
import { adminToken, merchantToken } from "./auth.test";

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Audit Logs API", () => {
  it("ADMIN can view audit logs", async () => {
    const res = await request(app)
      .get("/api/audit-logs")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
  });

  it("MERCHANT should not be allowed to view audit logs", async () => {
    const res = await request(app)
      .get("/api/audit-logs")
      .set("Authorization", `Bearer ${merchantToken}`);

    expect(res.statusCode).toEqual(403);
  });
});
