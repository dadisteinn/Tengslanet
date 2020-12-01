const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const auth = require("../middleware/auth");
const authservice = require("../services/authService");

// @route   GET api/auth
// @desc    Test route - Gets authenticated user by token
// @access  Public
router.get("/", auth, async (req, res) => {
  authservice.getAuthUser(
    req.user.id,
    function (user) {
      return res.json(user);
    },
    function (err) {
      if (err.code) {
        return res.status(err.code).json(err.err);
      }
      return res.status(500).send("Server error");
    }
  );
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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    authservice.loginUser(
      req.body,
      function (token) {
        return res.json({ token });
      },
      function (err) {
        if (err.code) {
          return res.status(err.code).json(err.err);
        }
        return res.status(500).send("Server error");
      }
    );
  }
);

module.exports = router;
