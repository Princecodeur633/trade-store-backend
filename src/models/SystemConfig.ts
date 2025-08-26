import { DataTypes } from "sequelize";
import sequelize from "../config/db";

const SystemConfig = sequelize.define("SystemConfig", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  key: { type: DataTypes.STRING, unique: true, allowNull: false },
  value: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: "system_configs",
  schema: "public",
  timestamps: true
});

export default SystemConfig;
