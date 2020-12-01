const express = require("express");
const { check, validationResult } = require("express-validator");

const router = express.Router();

const userService = require("../services/userService");

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must have at least 8 characters").isLength({
      min: 8,
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    userService.registerUser(
      req.body,
      function (result) {
        return res.send("User registered");
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
