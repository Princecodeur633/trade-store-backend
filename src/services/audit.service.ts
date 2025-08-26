import AuditLog from "../models/AuditLog";

export const logAction = async (userId: number, action: string, description?: string) => {
  return await AuditLog.create({ user_id: userId, action, description });
};
