export const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    message: err.message || "Something went wrong",
    statusCode: err.statusCode || 500,
  };
  if (err.name === "ValidationError") {
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = 400;
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    customError.message = "File must be less then 512kb";
    customError.statusCode = 400;
  }
  if (err.code && err.code === 11000) {
    customError.message = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }
  if (err.name === "CastError") {
    customError.message = `No item found with id : ${err.value}`;
    customError.statusCode = 404;
  }
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    customError.message = "Invalid JSON syntax";
    customError.statusCode = 400;
  }

  return res
    .status(customError.statusCode)
    .json({ message: customError.message });
};
