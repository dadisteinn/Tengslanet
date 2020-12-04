import { NotFoundError } from "../errors.js";

const pageNotFound = (req, res, next) => {
  const error = new NotFoundError("Page");
  next(error);
};

const errorHandler = (error, req, res, next) => {
  console.log("Error: ");
  console.error(error.log);
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
};

export { pageNotFound, errorHandler };
