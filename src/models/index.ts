import { Sequelize } from "sequelize";
import ProviderModel from "./Provider";
import CustomerModel from "./Customer";
import BillBatchModel from "./BillBatch";
import BillModel from "./Bill";

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    logging: false,
  }
);

// Init models
const Provider = ProviderModel(sequelize);
const Customer = CustomerModel(sequelize);
const BillBatch = BillBatchModel(sequelize);
const Bill = BillModel(sequelize);

// =====================
// Associations
// =====================

// Provider → Customers
Provider.hasMany(Customer, { foreignKey: "provider_id", onDelete: "CASCADE" });
Customer.belongsTo(Provider, { foreignKey: "provider_id" });

// Provider → BillBatches
Provider.hasMany(BillBatch, { foreignKey: "provider_id", onDelete: "CASCADE" });
BillBatch.belongsTo(Provider, { foreignKey: "provider_id" });

// BillBatch → Bills
BillBatch.hasMany(Bill, { foreignKey: "batch_id", onDelete: "SET NULL" });
Bill.belongsTo(BillBatch, { foreignKey: "batch_id" });

// Provider → Bills
Provider.hasMany(Bill, { foreignKey: "provider_id", onDelete: "CASCADE" });
Bill.belongsTo(Provider, { foreignKey: "provider_id" });

// Customer → Bills
Customer.hasMany(Bill, { foreignKey: "customer_id", onDelete: "CASCADE" });
Bill.belongsTo(Customer, { foreignKey: "customer_id" });

export { sequelize, Provider, Customer, BillBatch, Bill };
