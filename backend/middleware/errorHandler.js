const errorHandler = (err, req, res, next) => {
  console.error('ERROR LOG:', new Date().toISOString());
  console.error('Request Method:', req.method);
  console.error('Request URL:', req.originalUrl);
  console.error('Error:', err);

  // Sanitize error message for the user
  let userMessage = 'An unexpected error occurred. Please try again later.';
  if (err.isJoi) { // Example for Joi validation errors
    userMessage = 'Invalid input data.';
  } else if (err.name === 'CastError') {
    userMessage = `Invalid ${err.path}: ${err.value}.`;
  }

  // In development, send detailed error
  if (process.env.NODE_ENV === 'development') {
    return res.status(500).json({
      message: userMessage,
      error: err.message,
      stack: err.stack,
    });
  }

  // In production, send generic message
  res.status(500).json({ message: userMessage });
};

module.exports = errorHandler;