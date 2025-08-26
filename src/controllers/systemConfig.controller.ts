import { Request, Response } from "express";
import SystemConfig from "../models/SystemConfig";
import { successResponse, createdResponse, errorResponse } from "../utils/response";

export const createConfig = async (req: Request, res: Response) => {
  try {
    const config = await SystemConfig.create(req.body);
    return createdResponse(res, config, "System config created");
  } catch (err: any) {
    return errorResponse(res, err, 400);
  }
};

export const listConfigs = async (_req: Request, res: Response) => {
  try {
    const configs = await SystemConfig.findAll();
    return successResponse(res, configs);
  } catch (err: any) {
    return errorResponse(res, err, 400);
  }
};
