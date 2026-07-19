const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ message: messages.join(", ") });
  }
  if (err.code === 11000) {
    return res.status(400).json({ message: "That value is already taken" });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || "Something went wrong on the server",
  });
};

module.exports = errorHandler;
