const { DataTypes } = require("sequelize");
import sequelize from "../config/db";

const Payment = sequelize.define("Payment", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  method: { type: DataTypes.ENUM("STRIPE", "PAYPAL", "MOBILE_MONEY"), allowNull: false },
  transaction_id: { type: DataTypes.STRING, unique: true },
  amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  currency: { type: DataTypes.STRING, defaultValue: "USD" },
  status: { type: DataTypes.ENUM("PENDING", "PAID", "FAILED", "REFUNDED"), defaultValue: "PENDING" }
}, {
  tableName: "payments",
  schema: "public",
  timestamps: true
});

module.exports = Payment;
