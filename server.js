const express = require("express");
const connectDB = require("./data/db");
const globalErrorHandler = require("./middleware/globalErrorHandler");
const { NotFoundError } = require("./errors");

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

const app = express();

// Init middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API running"));

// Define routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/posts", require("./routes/posts"));

app.use((req, res, next) => {
  const error = new NotFoundError("Page");
  next(error);
});

app.use(globalErrorHandler);

app.listen(PORT, () => console.log(`Server starter on port ${PORT}`));
