import express from "express";
import connectDB from "./data/db.js";
import {
  pageNotFoundHandler,
  globalErrorHandler,
} from "./middleware/ErrorHandlerMiddleware.js";

import usersRoutes from "./routes/usersRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import postsRoutes from "./routes/postsRoutes.js";

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

const app = express();

// Init middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API running"));

// Define routes
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", postsRoutes);

app.use(pageNotFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => console.log(`Server starter on port ${PORT}`));
