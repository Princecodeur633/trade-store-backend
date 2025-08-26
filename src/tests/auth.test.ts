import request from "supertest";
import app from "../src/app";
import sequelize from "../src/config/db";

let adminToken: string;
let merchantToken: string;
let clientToken: string;

beforeAll(async () => {
  await sequelize.sync({ force: true }); // reset DB

  // Création Admin
  const adminRes = await request(app).post("/api/auth/register").send({
    full_name: "Admin User",
    email: "admin@test.com",
    password: "password123",
    role: "ADMIN"
  });
  adminToken = adminRes.body.data.token;

  // Création Merchant
  const merchantRes = await request(app).post("/api/auth/register").send({
    full_name: "Merchant User",
    email: "merchant@test.com",
    password: "password123",
    role: "MERCHANT"
  });
  merchantToken = merchantRes.body.data.token;

  // Création Client
  const clientRes = await request(app).post("/api/auth/register").send({
    full_name: "Client User",
    email: "client@test.com",
    password: "password123",
    role: "CLIENT"
  });
  clientToken = clientRes.body.data.token;
});

afterAll(async () => {
  await sequelize.close();
});

export { adminToken, merchantToken, clientToken };
