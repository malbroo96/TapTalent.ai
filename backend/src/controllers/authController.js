import { clearAuthCookie, createToken, setAuthCookie } from "../services/tokenService.js";

export const handleGoogleCallback = async (req, res) => {
  const token = createToken({ sub: req.user._id.toString() });
  setAuthCookie(res, token);
  res.redirect(process.env.CLIENT_URL || "http://localhost:5173");
};

export const getCurrentUser = async (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.profilePicture,
      favorites: req.user.favorites,
    },
  });
};

export const logout = async (_req, res) => {
  clearAuthCookie(res);
  res.status(200).json({ message: "Logged out successfully" });
};
