// Not Found Middleware
const notFound = (req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
};

// Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  res.status(500).json({ message: err.message || 'Server Error' });
};

module.exports = {
  notFound,
  errorHandler
}; 