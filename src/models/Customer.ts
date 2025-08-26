import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class Customer extends Model {}

  Customer.init(
    {
      id: { type: DataTypes.STRING(20), primaryKey: true },
      provider_id: { type: DataTypes.STRING(20), allowNull: false },
      name: { type: DataTypes.STRING(100), allowNull: false },
      phone: { type: DataTypes.STRING(15) },
      email: { type: DataTypes.STRING(100) },
      address: { type: DataTypes.TEXT },
      meter_number: { type: DataTypes.STRING(20), unique: true },
      account_number: { type: DataTypes.STRING(30), unique: true },
      customer_type: {
        type: DataTypes.ENUM("government", "business", "individual"),
        defaultValue: "individual",
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "suspended"),
        defaultValue: "active",
      },
      registration_date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
      last_bill_date: { type: DataTypes.DATEONLY },
      created_by: { type: DataTypes.STRING(20) },
      updated_by: { type: DataTypes.STRING(20) },
    },
    {
      sequelize,
      modelName: "Customer",
      tableName: "customers",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Customer;
};
