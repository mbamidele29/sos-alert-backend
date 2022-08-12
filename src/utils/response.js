const successResponse = (message, data = {}) => {
  return {
    message,
    data,
    success: true,
  };
};

const errorResponse = (message, data = {}) => {
  return {
    message,
    data,
    success: false,
  };
};

module.exports = {
  successResponse,
  errorResponse,
};
