import { Router } from "express";
import { createPayment, setPaymentStatus } from "../controllers/payment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/constants";

const router = Router();

// Seuls les marchands peuvent créer un paiement
router.post("/", authMiddleware([ROLES.MERCHANT]), createPayment);

// Seuls les admins peuvent modifier le statut
router.patch("/:id/status", authMiddleware([ROLES.ADMIN]), setPaymentStatus);

export default router;
