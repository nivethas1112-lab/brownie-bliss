export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const details = process.env.NODE_ENV === 'development' ? err.stack : undefined;

  res.status(statusCode).json({
    message,
    ...(details && { stack: details }),
    ...(err.errors && { errors: err.errors }),
    ...(err.data && { data: err.data })
  });
};

export const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
};
