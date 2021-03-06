import express from "express";
import connectDB from "./data/db.js";
import { pageNotFound, errorHandler } from "./middleware/errorMiddleware.js";

import accounthRoutes from "./routes/accountRoutes.js";
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
app.use("/api/account", accounthRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", postsRoutes);

app.use(pageNotFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server starter on port ${PORT}`));
