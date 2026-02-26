import User from "../models/User.js";
import { authCookieName, verifyToken } from "../services/tokenService.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.[authCookieName];
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const payload = verifyToken(token);
    const userId = payload?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
