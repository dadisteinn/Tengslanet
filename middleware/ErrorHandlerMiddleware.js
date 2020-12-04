import { NotFoundError } from "../errors.js";

const pageNotFoundHandler = (req, res, next) => {
  const error = new NotFoundError("Page");
  next(error);
};

const globalErrorHandler = (error, req, res, next) => {
  console.log("Error: ");
  console.error(error.log);
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
};

export { pageNotFoundHandler, globalErrorHandler };
