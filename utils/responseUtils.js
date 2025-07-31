export const sendResponse = (res, success, message, data = null, error = null) => {
  const statusCode = success ? 200 : 500;
  return res.status(statusCode).json({
    success,
    message,
    data,
    error,
  });
};
