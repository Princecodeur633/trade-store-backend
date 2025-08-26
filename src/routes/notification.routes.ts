import { Router } from "express";
import { createNotification, listNotifications } from "../controllers/notification.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/constants";

const router = Router();

// Admin + Marchant peuvent envoyer des notifications
router.post("/", authMiddleware([ROLES.ADMIN, ROLES.MERCHANT]), createNotification);

// Admin peut consulter toutes les notifications
router.get("/", authMiddleware([ROLES.ADMIN]), listNotifications);

export default router;
