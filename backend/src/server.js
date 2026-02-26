import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import { connectDB } from "./config/db.js";
import { configurePassport } from "./config/passport.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

configurePassport();
app.use(passport.initialize());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    mongoReadyState: mongoose.connection?.readyState ?? -1,
    hasJwtSecret: Boolean(process.env.JWT_SECRET),
    hasGoogleClientId: Boolean(process.env.GOOGLE_CLIENT_ID),
    hasGoogleClientSecret: Boolean(process.env.GOOGLE_CLIENT_SECRET),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/user", userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("[boot] Mongo connected. readyState:", mongoose.connection.readyState);
    app.listen(PORT, () => {
      console.log(`[boot] Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("[boot] Failed to start server:", error.message);
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason) => {
  console.error("[process] unhandledRejection:", reason?.message || reason);
});

process.on("uncaughtException", (error) => {
  console.error("[process] uncaughtException:", error.message);
});

startServer();
