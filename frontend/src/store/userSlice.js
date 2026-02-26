import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favorites: [],
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserLoading: (state) => {
      state.status = "loading";
      state.error = null;
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    appendFavorite: (state, action) => {
      const city = action.payload;
      const exists = state.favorites.some(
        (item) => item.name.toLowerCase() === city.name.toLowerCase(),
      );
      if (!exists) {
        state.favorites.push(city);
      }
      state.status = "succeeded";
    },
    removeFavorite: (state, action) => {
      const cityName = action.payload.toLowerCase();
      state.favorites = state.favorites.filter(
        (item) => item.name.toLowerCase() !== cityName,
      );
      state.status = "succeeded";
      state.error = null;
    },
    setUserError: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const {
  setUserLoading,
  setFavorites,
  appendFavorite,
  removeFavorite,
  setUserError,
} = userSlice.actions;

export default userSlice.reducer;
