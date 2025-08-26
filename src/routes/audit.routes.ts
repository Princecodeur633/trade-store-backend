import { Router } from "express";
import { listAuditLogs } from "../controllers/audit.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/constants";

const router = Router();

// Seul ADMIN peut consulter les logs
router.get("/", authMiddleware([ROLES.ADMIN]), listAuditLogs);

export default router;
