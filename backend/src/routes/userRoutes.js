import { Router } from "express";
import {
  addFavorite,
  deleteFavorite,
  getFavorites,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authMiddleware);
router.get("/favorites", getFavorites);
router.post("/favorites", addFavorite);
router.delete("/favorites/:city", deleteFavorite);

export default router;
