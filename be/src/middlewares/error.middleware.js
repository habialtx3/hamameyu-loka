const { sendError } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return sendError(res, message, statusCode, process.env.NODE_ENV === 'development' ? { stack: err.stack } : null);
};

module.exports = errorHandler;
