import { Router } from "express";
import {
  getForecastByCity,
  getWeatherByCity,
} from "../controllers/weatherController.js";

const router = Router();

router.get("/", getWeatherByCity);
router.get("/forecast", getForecastByCity);

export default router;
