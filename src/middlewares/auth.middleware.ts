import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ROLES } from "../utils/constants";

export interface AuthRequest extends Request {
  user?: { id: number; email: string; role: string };
}

export const authMiddleware = (roles: string[] = []) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "No token provided" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      req.user = { id: decoded.id, email: decoded.email, role: decoded.role };

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied: insufficient role" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};
