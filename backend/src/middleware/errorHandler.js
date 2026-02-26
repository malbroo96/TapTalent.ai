export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || err.status || 500;
  const isServerError = statusCode >= 500;

  res.status(statusCode).json({
    message: isServerError ? "Internal server error" : err.message,
  });
};
