import { Request, Response } from "express";
import { successResponse, errorResponse } from "../utils/response";
import AuditLog from "../models/AuditLog";

export const listAuditLogs = async (_req: Request, res: Response) => {
  try {
    const logs = await AuditLog.findAll({ order: [["createdAt", "DESC"]], limit: 50 });
    return successResponse(res, logs);
  } catch (err: any) {
    return errorResponse(res, err, 400);
  }
};
