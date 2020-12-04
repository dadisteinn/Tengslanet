import express from "express";
import { check, validationResult } from "express-validator";
import auth from "../middleware/authMiddleware.js";
import { ServerError } from "../errors.js";
import accountService from "../services/accountService.js";

const router = express.Router();

// @route   POST api/account
// @desc    Register new user
// @access  Public
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must have at least 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const token = await accountService.registerUser(req.body);
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

// @route   POST api/account
// @desc    Signin user
// @access  Public
router.post(
  "/signin",
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
      const token = await accountService.loginUser(req.body);
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

// @route    GET api/account
// @desc     Get user by token
// @access   Private
router.get("/", auth, async (req, res, next) => {
  try {
    const user = await accountService.getUserByToken(req.user.id);
    return res.json(user);
  } catch (error) {
    if (error.log) {
      return next(error);
    }
    error = new ServerError(error.message);
    next(error);
  }
});

export default router;
