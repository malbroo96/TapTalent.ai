export const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || err.status || 500;
  const isServerError = statusCode >= 500;
  if (isServerError) {
    console.error(
      `Unhandled error on ${req.method} ${req.originalUrl}:`,
      err.message,
    );
  }

  const isDev = process.env.NODE_ENV !== "production";
  res.status(statusCode).json({
    message: isServerError && !isDev ? "Internal server error" : err.message,
  });
};
