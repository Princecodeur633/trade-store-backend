import { Router } from "express";
import { createConfig, listConfigs } from "../controllers/systemConfig.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/constants";

const router = Router();

// Seul ADMIN peut créer une config système
router.post("/", authMiddleware([ROLES.ADMIN]), createConfig);

// ADMIN + MERCHANT peuvent consulter les configs
router.get("/", authMiddleware([ROLES.ADMIN, ROLES.MERCHANT]), listConfigs);

export default router;
