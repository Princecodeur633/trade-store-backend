import { Response } from "express";

export const successResponse = (res: Response, data: any, message = "Success") => {
  return res.status(200).json({
    status: "success",
    message,
    data,
  });
};

export const createdResponse = (res: Response, data: any, message = "Created successfully") => {
  return res.status(201).json({
    status: "success",
    message,
    data,
  });
};

export const errorResponse = (res: Response, error: any, code = 400) => {
  return res.status(code).json({
    status: "error",
    message: error.message || "An error occurred",
  });
};

export const notFoundResponse = (res: Response, message = "Resource not found") => {
  return res.status(404).json({
    status: "error",
    message,
  });
};
