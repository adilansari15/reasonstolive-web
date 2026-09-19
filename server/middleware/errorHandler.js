/**
 * Centralized Error Handler Middleware
 */
export function errorHandler(err, req, res, _next) {
  // Log error
  console.error(`💥 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}:`, err);

  let statusCode = err.statusCode || 500;
  let errorMessage = err.message || "Internal Server Error";

  // Handle Mongoose Validation Errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    const messages = Object.values(err.errors).map((val) => val.message);
    errorMessage = messages.join(", ") || "Validation Error";
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 404;
    errorMessage = `Resource not found with id: ${err.value}`;
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    errorMessage = "Duplicate field value entered";
  }

  res.status(statusCode).json({
    success: false,
    error: errorMessage,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
