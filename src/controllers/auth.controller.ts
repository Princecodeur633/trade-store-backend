import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { createdResponse, successResponse, errorResponse } from "../utils/response";
import { AUDIT_ACTIONS } from "../utils/constants";
import { logAction } from "../services/audit.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { user, token } = await registerUser(req.body);

    // Log action
    await logAction(user.id, AUDIT_ACTIONS.LOGIN, "User registered");

    return createdResponse(res, { user, token }, "User registered successfully");
  } catch (err: any) {
    return errorResponse(res, err, 400);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);

    // Log action
    await logAction(user.id, AUDIT_ACTIONS.LOGIN, "User logged in");

    return successResponse(res, { user, token }, "Login successful");
  } catch (err: any) {
    return errorResponse(res, err, 401);
  }
};
