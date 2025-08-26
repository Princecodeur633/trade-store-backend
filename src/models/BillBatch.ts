import { DataTypes, Model, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class BillBatch extends Model {}

  BillBatch.init(
    {
      id: { type: DataTypes.STRING(32), primaryKey: true },
      provider_id: { type: DataTypes.STRING(20), allowNull: false },
      batch_name: { type: DataTypes.STRING(100), allowNull: false },
      file_name: { type: DataTypes.STRING(200) },
      file_size: { type: DataTypes.INTEGER },
      file_hash: { type: DataTypes.STRING(64), unique: true, allowNull: false },
      total_records: { type: DataTypes.INTEGER, defaultValue: 0 },
      processed_records: { type: DataTypes.INTEGER, defaultValue: 0 },
      failed_records: { type: DataTypes.INTEGER, defaultValue: 0 },
      status: {
        type: DataTypes.ENUM("pending", "processed", "failed", "completed", "cancelled"),
        defaultValue: "pending",
      },
      updated_method: {
        type: DataTypes.ENUM("csv", "api", "excel", "sftp"),
        defaultValue: "csv",
      },
      processing_started_at: { type: DataTypes.DATE },
      processing_completed_at: { type: DataTypes.DATE },
      error_summary: { type: DataTypes.TEXT },
      created_by: { type: DataTypes.STRING(20) },
      updated_by: { type: DataTypes.STRING(20) },
    },
    {
      sequelize,
      modelName: "BillBatch",
      tableName: "bill_batches",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return BillBatch;
};
