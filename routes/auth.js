const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const auth = require("../middleware/auth");
const authservice = require("../services/authService");
const { ServerError } = require("../errors");

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

module.exports = router;
