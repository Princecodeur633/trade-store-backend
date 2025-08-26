import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const AuditLog = sequelize.define("AuditLog", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER },
  action: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
}, {
  tableName: "audit_logs",
  schema: "public",
  timestamps: true
});

export default AuditLog;
