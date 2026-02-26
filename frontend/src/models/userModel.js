export const normalizeUser = (data = {}) => ({
  id: data.id ?? data._id ?? "",
  name: data.name ?? "User",
  email: data.email ?? "",
  avatar: data.avatar ?? "",
});

export const normalizeFavoriteCity = (city = {}) => ({
  id: city.id ?? city._id ?? city.name ?? "",
  name: city.name ?? city.city ?? "",
  country: city.country ?? "",
});
