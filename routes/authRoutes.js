import express from "express";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth.js";
import authservice from "../services/authService.js";
import { ServerError } from "../errors.js";

const router = express.Router();
// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get("/", auth, async (req, res, next) => {
  try {
    const user = await authservice.getAuthUser(req.user.id);
    return res.json(user);
  } catch (error) {
    if (error.log) {
      return next(error);
    }
    error = new ServerError(error.message);
    next(error);
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const token = await authservice.loginUser(req.body);
      return res.json({ token });
    } catch (error) {
      if (error.log) {
        return next(error);
      }
      error = new ServerError(error.message);
      next(error);
    }
  }
);

export default router;
