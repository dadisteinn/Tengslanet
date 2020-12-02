const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const auth = require("../middleware/auth");
const authservice = require("../services/authService");

// @route   GET api/auth
// @desc    Test route - Gets authenticated user by token
// @access  Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await authservice.getAuthUser(req.user.id);
    return res.json(user);
  } catch (err) {
    if (err.code) {
      return res.status(err.code).json(err.err);
    }
    console.error(err.message);
    return res.status(500).send("Server error");
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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const token = await authservice.loginUser(req.body);
      return res.json({ token });
    } catch (err) {
      if (err.code) {
        return res.status(err.code).json(err.err);
      }
      console.error(err.message);
      return res.status(500).send("Server error");
    }
  }
);

module.exports = router;
