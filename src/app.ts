import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import paymentRoutes from "./routes/payment.routes";
import notificationRoutes from "./routes/notification.routes";
import auditRoutes from "./routes/audit.routes";
import systemConfigRoutes from "./routes/systemConfig.routes";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/system-configs", systemConfigRoutes);

export default app;
