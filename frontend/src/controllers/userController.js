import { normalizeFavoriteCity } from "../models/userModel";
import apiClient from "../services/apiClient";
import {
  appendFavorite,
  setFavorites,
  setUserError,
  setUserLoading,
} from "../store/userSlice";

export const fetchFavorites = () => async (dispatch) => {
  dispatch(setUserLoading());
  try {
    const response = await apiClient.get("/user/favorites");
    const favorites = (response.data?.favorites ?? response.data ?? []).map(
      normalizeFavoriteCity,
    );
    dispatch(setFavorites(favorites));
  } catch (error) {
    dispatch(setUserError(error.message));
  }
};

export const addFavoriteCity = (city) => async (dispatch) => {
  dispatch(setUserLoading());
  try {
    const response = await apiClient.post("/user/favorites", { city });
    const favorite = normalizeFavoriteCity(
      response.data?.favorite ?? { name: city },
    );
    dispatch(appendFavorite(favorite));
  } catch (error) {
    dispatch(setUserError(error.message));
  }
};
