const express = require("express");
const connectDB = require("./data/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Init middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API running"));

// Define routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/posts", require("./routes/posts"));

app.listen(PORT, () => console.log(`Server starter on port ${PORT}`));
