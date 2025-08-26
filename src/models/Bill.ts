import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class Bill extends Model {}

  Bill.init(
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      provider_id: { type: DataTypes.STRING(20), allowNull: false },
      customer_id: { type: DataTypes.STRING(20), allowNull: false },
      batch_id: { type: DataTypes.STRING(32) },
      bill_reference: { type: DataTypes.STRING(30), allowNull: false },
      amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      currency: { type: DataTypes.STRING(3), defaultValue: "XAF" },
      due_date: { type: DataTypes.DATEONLY, allowNull: false },
      billing_period: { type: DataTypes.STRING(20), allowNull: false },
      service_address: { type: DataTypes.TEXT },
      previous_reading: { type: DataTypes.INTEGER },
      current_reading: { type: DataTypes.INTEGER },
      consumption: { type: DataTypes.INTEGER },
      tarriff_category: {
        type: DataTypes.ENUM("residential", "commercial", "industrial", "government"),
        defaultValue: "residential",
      },
      taxes: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
      fees: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
      discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
      status: {
        type: DataTypes.ENUM("pending", "paid", "overdue", "cancelled", "disputed"),
        defaultValue: "pending",
      },
      bill_metadata: { type: DataTypes.JSON },
      generated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      notified_at: { type: DataTypes.DATE },
      paid_at: { type: DataTypes.DATE },
      payment_reference: { type: DataTypes.STRING(100) },
      payment_method: {
        type: DataTypes.ENUM("credit_card", "bank_transfer", "airtel_money", "mobile_money", "cash"),
        defaultValue: "bank_transfer",
      },
      payment_amount: { type: DataTypes.DECIMAL(12, 2) },
      created_by: { type: DataTypes.STRING(20) },
      updated_by: { type: DataTypes.STRING(20) },
    },
    {
      sequelize,
      modelName: "Bill",
      tableName: "bills",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Bill;
};
