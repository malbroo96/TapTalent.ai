const sanitizeCity = (city) => (city || "").trim();

export const getFavorites = async (req, res) => {
  return res.status(200).json({ favorites: req.user.favorites || [] });
};

export const addFavorite = async (req, res, next) => {
  try {
    const city = sanitizeCity(req.body.city);
    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const exists = req.user.favorites.some(
      (fav) => fav.toLowerCase() === city.toLowerCase(),
    );

    if (!exists) {
      req.user.favorites.push(city);
      await req.user.save();
    }

    return res.status(200).json({ favorites: req.user.favorites });
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

    req.user.favorites = req.user.favorites.filter(
      (fav) => fav.toLowerCase() !== city.toLowerCase(),
    );
    await req.user.save();

    return res.status(200).json({ favorites: req.user.favorites });
  } catch (error) {
    return next(error);
  }
};
