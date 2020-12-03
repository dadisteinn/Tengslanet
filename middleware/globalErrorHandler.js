module.exports = function (error, req, res, next) {
  console.log("Error: ");
  console.error(error.log);
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
};
