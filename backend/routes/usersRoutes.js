import express from "express";
import { check, validationResult } from "express-validator";
import userService from "../services/userService.js";

const router = express.Router();

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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const token = await userService.registerUser(req.body);
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

export default router;
