import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const Notification = sequelize.define("Notification", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  channel: { type: DataTypes.ENUM("EMAIL", "SMS"), allowNull: false },
  recipient: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM("PENDING", "SENT", "FAILED"), defaultValue: "PENDING" }
}, {
  tableName: "notifications",
  schema: "public",
  timestamps: true
});

export default Notification;
