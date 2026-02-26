const sanitizeCity = (city) => (city || "").trim();
const getFavoritesArray = (user) =>
  Array.isArray(user?.favorites) ? user.favorites : [];

export const getFavorites = async (req, res) => {
  return res.status(200).json({ favorites: getFavoritesArray(req.user) });
};

export const addFavorite = async (req, res, next) => {
  try {
    const city = sanitizeCity(req.body.city);
    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const favorites = getFavoritesArray(req.user);

    const exists = favorites.some(
      (fav) => fav.toLowerCase() === city.toLowerCase(),
    );

    if (!exists) {
      favorites.push(city);
      req.user.favorites = favorites;
      await req.user.save();
    }

    return res.status(200).json({ favorites });
  } catch (error) {
    return next(error);
  }
};

export const deleteFavorite = async (req, res, next) => {
  try {
    const city = sanitizeCity(req.params.city);
    if (!city) {
      return res.status(400).json({ message: "City parameter is required" });
    }

    req.user.favorites = getFavoritesArray(req.user).filter(
      (fav) => fav.toLowerCase() !== city.toLowerCase(),
    );
    await req.user.save();

    return res.status(200).json({ favorites: req.user.favorites });
  } catch (error) {
    return next(error);
  }
};
