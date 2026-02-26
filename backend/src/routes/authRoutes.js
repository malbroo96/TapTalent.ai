import { Router } from "express";
import passport from "passport";
import mongoose from "mongoose";
import {
  getCurrentUser,
  handleGoogleCallback,
  logout,
} from "../controllers/authController.js";
import { isPassportConfigured } from "../config/passport.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

const ensureGoogleAuthReady = (req, res, next) => {
  if (!isPassportConfigured()) {
    return res.status(503).json({ message: "Google auth is not configured" });
  }

  if (mongoose.connection?.readyState !== 1) {
    return res.status(503).json({ message: "Database not connected" });
  }

  return next();
};

router.get(
  "/google",
  ensureGoogleAuthReady,
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get("/google/callback", ensureGoogleAuthReady, (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err) {
      console.error("[auth/callback] passport error:", err.message);
      if (err.oauthError) {
        console.error("[auth/callback] oauthError statusCode:", err.oauthError.statusCode);
        console.error("[auth/callback] oauthError data:", err.oauthError.data?.toString?.() || err.oauthError.data);
      }
      const clientUrl = new URL(process.env.CLIENT_URL || "http://localhost:5173");
      clientUrl.pathname = "/auth";
      clientUrl.searchParams.set("error", "google_oauth_failed");
      clientUrl.searchParams.set("reason", err.message || "unknown");
      return res.redirect(clientUrl.toString());
    }

    if (!user) {
      console.error("[auth/callback] no user from passport");
      const clientUrl = new URL(process.env.CLIENT_URL || "http://localhost:5173");
      clientUrl.pathname = "/auth";
      clientUrl.searchParams.set("error", "google_user_missing");
      return res.redirect(clientUrl.toString());
    }

    req.user = user;
    return handleGoogleCallback(req, res, next);
  })(req, res, next);
});

router.get("/me", authMiddleware, getCurrentUser);
router.post("/logout", authMiddleware, logout);

export default router;
