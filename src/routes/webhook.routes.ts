import { Router } from "express";
import { stripeWebhook, paypalWebhook, mobileMoneyWebhook } from "../controllers/webhook.controller";

const router = Router();

// ⚠️ Pas de authMiddleware car les webhooks viennent des providers externes
router.post("/stripe", stripeWebhook);
router.post("/paypal", paypalWebhook);
router.post("/mobile-money", mobileMoneyWebhook);

export default router;
