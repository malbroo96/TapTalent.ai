import { clearAuthCookie, createToken, setAuthCookie } from "../services/tokenService.js";
import mongoose from "mongoose";

export const handleGoogleCallback = async (req, res, next) => {
  try {
    console.log("[auth/callback] req.user present:", Boolean(req.user));
    console.log("[auth/callback] JWT_SECRET configured:", Boolean(process.env.JWT_SECRET));
    console.log(
      "[auth/callback] mongo readyState:",
      mongoose.connection?.readyState ?? "unknown",
    );

    if (!req.user?._id) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Server auth configuration missing" });
    }

    const token = createToken({ sub: req.user._id.toString() });
    setAuthCookie(res, token);
    const redirectUrl = new URL(
      process.env.CLIENT_URL || "http://localhost:5173",
    );
    // Fallback for strict browsers that block localhost cookies in XHR.
    redirectUrl.searchParams.set("token", token);
    return res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("[auth/callback] failed:", error.message);
    return next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    return res.status(200).json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.profilePicture,
        favorites: Array.isArray(req.user.favorites) ? req.user.favorites : [],
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (_req, res, next) => {
  try {
    clearAuthCookie(res);
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return next(error);
  }
};
