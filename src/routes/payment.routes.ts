import { Router } from "express";
import { createPayment, setPaymentStatus } from "../controllers/payment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware(["MERCHANT", "ADMIN"]), createPayment);
router.patch("/:id/status", authMiddleware(["ADMIN"]), setPaymentStatus);

export default router;
