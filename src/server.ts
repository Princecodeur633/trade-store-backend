import dotenv from "dotenv";
import app from "./app";
import sequelize from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected");

    await sequelize.sync({ alter: true }); // en dev seulement
    console.log("✅ Models synchronized");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ DB connection error:", error);
  }
})();
